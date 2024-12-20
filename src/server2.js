const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const axios = require("axios");

require("dotenv").config(); // Load environment variables

const User = require("./models/User"); // Import User schema

const app = express();
const PORT = process.env.PORT || 5000;

// Constants
const SPOONACULAR_API_KEY = "725e92e0455f4cc5bcf3cf289d5fc86e"; // Replace with your Spoonacular API key


// Dietary restriction arrays for different diets
const VEGETARIAN_RESTRICTED_INGREDIENTS = [
    "chicken", "beef", "pork", "lamb", "turkey", "duck", "fish", "seafood"
  ];
  
  const VEGAN_RESTRICTED_INGREDIENTS = [
    "chicken", "beef", "pork", "lamb", "turkey", "duck", "fish", "seafood", "milk", "cheese", "butter", "eggs"
  ];
  
  const PESCO_VEGETARIAN_RESTRICTED_INGREDIENTS = [
    "chicken", "beef", "pork", "lamb", "turkey", "duck", "seafood" // Pesco-vegetarian includes fish, but not other meats
  ];
  
  const GLUTEN_FREE_RESTRICTED_INGREDIENTS = [
    "wheat", "barley", "rye", "oats"
  ];
  
  const DAIRY_FREE_RESTRICTED_INGREDIENTS = [
    "milk", "cheese", "butter", "cream"
  ];
  
  const NUT_FREE_RESTRICTED_INGREDIENTS = [
    "almond", "cashew", "hazelnut", "walnut", "peanut", "pecan"
  ];
  
  const SOYA_FREE_RESTRICTED_INGREDIENTS = [
    "tofu", "tempeh", "soy", "edamame", "soy sauce"
  ];
  
  const EGG_FREE_RESTRICTED_INGREDIENTS = [
    "egg", "mayonnaise", "mayo"
  ];
  
  const HALAL_RESTRICTED_INGREDIENTS = [
    "pork", "alcohol"
  ];
  
  const OMNIVORE_RESTRICTED_INGREDIENTS = [] // Omnivores are not restricted
  
// Helper function to filter ingredients based on dietType
const filterIngredientsByDietType = (ingredients, dietType) => {
    let restrictedIngredients = [];
  
    switch (dietType) {
      case 'Végétalien (Vegan)':
        restrictedIngredients = VEGAN_RESTRICTED_INGREDIENTS;
        break;
      case 'Végétarien':
        restrictedIngredients = VEGETARIAN_RESTRICTED_INGREDIENTS;
        break;
      case 'Pesco-végétarien':
        restrictedIngredients = PESCO_VEGETARIAN_RESTRICTED_INGREDIENTS;
        break;
      case 'Sans Gluten':
        restrictedIngredients = GLUTEN_FREE_RESTRICTED_INGREDIENTS;
        break;
      case 'Sans Produits Laitiers':
        restrictedIngredients = DAIRY_FREE_RESTRICTED_INGREDIENTS;
        break;
      case 'Sans Noix':
        restrictedIngredients = NUT_FREE_RESTRICTED_INGREDIENTS;
        break;
      case 'Sans Soja':
        restrictedIngredients = SOYA_FREE_RESTRICTED_INGREDIENTS;
        break;
      case 'Sans Œufs':
        restrictedIngredients = EGG_FREE_RESTRICTED_INGREDIENTS;
        break;
      case 'Halal':
        restrictedIngredients = HALAL_RESTRICTED_INGREDIENTS;
        break;
      case 'Omnivore':
        restrictedIngredients = OMNIVORE_RESTRICTED_INGREDIENTS;
        break;
      default:
        return ingredients; // If no diet type is set, return all ingredients
    }
  
    // Filter out ingredients that are in the restricted list for the given dietType
    return ingredients.filter(ingredient => !restrictedIngredients.includes(ingredient.toLowerCase()));
  };
  

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000"], // Add all allowed origins here
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// MongoDB Connection
const mongoURI =
  "mongodb+srv://hh:hhhhhhhh@cluster0.5eb3y.mongodb.net/recette?retryWrites=true&w=majority";

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "1234",
    resave: false, // changed from true to false
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Fixed the secure setting
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    name: "sessionId", // Add this line to use a custom cookie name
  })
);

app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session Data:", req.session);
  next();
});

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas: ", err));

// Helper functions
const filterNonVegetarianIngredients = (ingredients) => {
  return ingredients.filter(
    (ingredient) => !MEAT_KEYWORDS.includes(ingredient.toLowerCase())
  );
};

const cleanRecipeName = (title) => {
  return title.replace(/^How to Make\s+/i, ""); // Remove 'How to' at the beginning of the title
};

// Routes
app.get('/api/user-preferences', async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  
    try {
      const user = await User.findOne({ email: req.session.user.email });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Ensure the user preferences (including dietType) are returned
      const dietType = user.foodPreferences.dietType || 'Not Set';
      
      res.status(200).json({ dietType });  // Send the dietType as a response
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.post('/api/save-preferences', async (req, res) => {
    // Save preferences route
    console.log('Session data:', req.session);
    console.log('Request body:', req.body);
  
    // Check if user is logged in
    if (!req.session.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  
    try {
      const { dietType } = req.body;
  
      // Find the user in the database
      const user = await User.findOne({ email: req.session.user.email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update the user's food preferences with dietType
      user.foodPreferences = { dietType }; 
      await user.save();
  
      res.status(200).json({ message: 'Preferences saved successfully!' });
    } catch (error) {
      console.error('Error saving preferences:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  app.get('/fetch-recipes/:ingredients', async (req, res) => {
    const ingredientsParam = req.params.ingredients;
    const dietType = req.session.user?.foodPreferences?.dietType; // Fetch dietType from session
    
    let ingredients = ingredientsParam.split(',');
    
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide valid ingredients.' });
    }
    
    // Filter ingredients based on the dietType
    if (dietType) {
      ingredients = filterIngredientsByDietType(ingredients, dietType);
      
    }
    console.log("Ingredients after filtering:", ingredients); // Log ingredients after filtering
  
    if (ingredients.length === 0) {
      return res.status(400).json({ error: 'No valid ingredients were provided after filtering.' });
    }
  
    const ingredientsString = ingredients.join(',');
    console.log("Ingredients string for Spoonacular API:", ingredientsString); // Log the string sent to Spoonacular API

    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsString}&apiKey=${SPOONACULAR_API_KEY}${dietType ? `&diet=${dietType}` : ''}`
      );
  
      if (response.data.length === 0) {
        return res.status(404).send('No recipes found.');
      }
  
      const detailedRecipes = await Promise.all(response.data.map(async recipe => {
        const recipeDetailResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`);
        let { title, readyInMinutes, instructions, extendedIngredients } = recipeDetailResponse.data;
  
        title = cleanRecipeName(title);
        const usedIngredients = extendedIngredients.map(ing => ing.name).join(', ');
  
        return `Recipe Name: ${title}\nCooking Time: ${readyInMinutes} minutes\nIngredients: ${usedIngredients}\nInstructions: ${instructions}\n\n`;
      }));
  
      const filteredRecipes = detailedRecipes.filter(recipe => recipe !== null);
  
      if (filteredRecipes.length === 0) {
        return res.status(404).send('No suitable recipes found.');
      }
  
      res.send(`<pre>${filteredRecipes.join('\n\n')}</pre>`);
    } catch (error) {
      console.error('Error fetching recipes:', error.message);
      res.status(500).json({ error: 'Error fetching recipes from API.' });
    }
  });
  
// Authentication and User Management Routes (Signup, Login, Confirm Email)

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, foodPreferences } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      full_name: fullName,
      email,
      password: hashedPassword,
      token,
      isVerified: false,
      foodPreferences: foodPreferences || {},
    });

    await newUser.save();

    const confirmationLink = `http://localhost:5000/confirm/${token}`;

    const mailOptions = {
      from: "recette.magique.cy@gmail.com",
      to: email,
      subject: "Email Confirmation",
      html: `<h1>Welcome ${fullName}!</h1>
                   <p>Please confirm your email by clicking the link: 
                   <a href="${confirmationLink}">Confirm Email</a></p>`,
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "recette.magique.cy@gmail.com",
        pass: "jyoj afjs utcm swwe",
      },
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ message: "Error sending confirmation email" });
      }
      console.log("Confirmation email sent:", info.response);
      res
        .status(200)
        .json({
          message: "User registered successfully, please confirm your email",
        });
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: "Email not confirmed. Please check your inbox." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Save user data in session
    req.session.user = {
      email: user.email,
      fullName: user.full_name,
      id: user._id, // Add this line
      foodPreferences: user.foodPreferences,  // Make sure to save the food preferences (including dietType)

    };

    // Save session explicitly
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Session error" });
      }
      const redirectUrl =
        Object.keys(user.foodPreferences).length === 0
          ? "/preferences"
          : "/dashboard";
      res.status(200).json({ message: "Login successful", redirectUrl });
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error" });
  }
});
// Email confirmation
app.get("/confirm/:token", async (req, res) => {
  try {
    const token = req.params.token;

    const user = await User.findOne({ token });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid token or user already verified" });
    }

    if (user.isVerified) {
      return res.redirect("http://localhost:3000/login");
    }

    user.isVerified = true;
    user.token = null;
    await user.save();

    res.redirect("http://localhost:3000/login");
  } catch (error) {
    console.error("Error confirming token:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Dashboard
app.get("/dashboard", (req, res) => {
  if (req.session.user) {
    res.json({ message: "Welcome to the dashboard!", user: req.session.user });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to log out" });
    }

    res.clearCookie("connect.sid"); // Clear the session cookie
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
