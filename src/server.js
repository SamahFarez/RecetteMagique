// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session'); // Import express-session
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
const port = 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Change to your frontend URL
    credentials: true // Allow cookies to be sent
}));

app.use(express.json());


// Configure express-session middleware
app.use(session({
    secret: '123', // Change this to a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'ikram',
    password: 'hhhhhhhh',
    database: 'recettemagique'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL');
});



// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services too
    auth: {
        user: 'samah.ikramfarez@gmail.com', // Your email
        pass: 'foqf vrer mjed uirp' // Your email password or an app password
    }
});

// Signup function
const handleSignup = (req, res) => {
    console.log('Starting signup process...'); // Log the start
    const { fullName, email, password } = req.body;

    // Check if user already exists
    console.log('Checking if user exists...');
    const checkUserQuery = 'SELECT * FROM Users WHERE email = ?';
    db.query(checkUserQuery, [email], (err, result) => {
        if (err) {
            console.error('Error checking for existing user:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (result.length > 0) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Hashing password...');
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ message: 'Error hashing password' });
            }

            // Create a confirmation token
            const token = crypto.randomBytes(32).toString('hex');

            // Use the correct column names here
            const insertUserQuery = 'INSERT INTO Users (full_name, email, password, token, isVerified) VALUES (?, ?, ?, ?, 0)';
            db.query(insertUserQuery, [fullName, email, hashedPassword, token], (err) => {
                if (err) {
                    console.error('Error inserting new user:', err);
                    return res.status(500).json({ message: 'Error registering user' });
                }

                // Send confirmation email
                const confirmationLink = `http://localhost:3000/confirm/${token}`;
                const mailOptions = {
                    from: 'your-email@gmail.com',
                    to: email,
                    subject: 'Email Confirmation',
                    html: `<h1>Welcome ${fullName}!</h1>
                           <p>Please confirm your email by clicking the link: 
                           <a href="${confirmationLink}">Confirm Email</a></p>`
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        return res.status(500).json({ message: 'Error sending confirmation email' });
                    }
                    console.log('Confirmation email sent:', info.response);
                    res.status(200).json({ message: 'User registered successfully, please confirm your email' });
                });
            });
        });
    });
};


// Login function
const handleLogin = (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM Users WHERE email = ?';
    db.query(query, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (result.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const user = result[0];

        // Compare passwords using bcrypt
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(401).json({ error: 'Incorrect password' });
            }

            // Create a session for the user
            req.session.user = {
                email: user.email,
                fullName: user.full_name, // Adjust according to your user schema
            };

            console.log('Session created:', req.session.user); // Log the session for debugging

            // Send a success response
            res.json({ message: 'Login successful', user });
        });
    });
};

// Dashboard route
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.json({ message: 'Welcome to the dashboard!', user: req.session.user });
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
});

app.get('/confirm/:token', (req, res) => {
    const token = req.params.token;

    const verifyTokenQuery = 'UPDATE Users SET isVerified = 1 WHERE token = ?';
    db.query(verifyTokenQuery, [token], (err, result) => {
        if (err) {
            console.error('Error confirming token:', err);
            return res.status(500).json({ message: 'Server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Invalid token or user already verified' });
        }

        res.status(200).json({ message: 'Email confirmed successfully!' });
    });
});


// Signup route
app.post('/signup', handleSignup);

// Login route
app.post('/login', handleLogin);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
