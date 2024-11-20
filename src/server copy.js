const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config(); // Load environment variables

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
    secret: process.env.SESSION_SECRET || 'your_default_secret', // Use env variable
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/recettemagique'; // Use env variable
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB: ', err));

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Use env variable
        pass: process.env.EMAIL_PASS  // Use env variable
    }
});

// Models
const User = require('./models/User'); // Import User schema

// Function to generate a random verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code
};

// Signup function
const handleSignup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate token
        const token = crypto.randomBytes(32).toString('hex');

        // Create new user
        const newUser = new User({
            full_name: fullName,
            email,
            password: hashedPassword,
            token,
            isVerified: false
        });

        await newUser.save();

        // Send confirmation email
        const confirmationLink = `http://localhost:3000/confirm/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
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

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login function
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ error: 'Email not confirmed. Please check your inbox.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        req.session.user = {
            email: user.email,
            fullName: user.full_name
        };

        res.json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Dashboard route
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.json({ message: 'Welcome to the dashboard!', user: req.session.user });
    } else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
});

// Email confirmation endpoint
app.get('/confirm/:token', async (req, res) => {
    const token = req.params.token;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid token or user already verified' });
        }

        user.isVerified = true;
        user.token = null;
        await user.save();

        res.status(200).json({ 
            message: 'Email confirmed successfully!', 
            redirectUrl: 'http://localhost:3000/login' // Adjust the URL if needed
        });
    } catch (error) {
        console.error('Error confirming token:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Signup route
app.post('/signup', handleSignup);

// Login route
app.post('/login', handleLogin);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
