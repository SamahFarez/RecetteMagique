const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the CORS package
const app = express();
const PORT = process.env.PORT || 4000;

const SPOONACULAR_API_KEY = '23a7bcbc7632490a9d0cbdd754f79fcc'; // Your API key

// Use CORS middleware to allow requests from your frontend (localhost:3000)
app.use(cors());

// List of common meat ingredients to check against
const meatKeywords = ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'fish', 'seafood'];

// Function to filter out non-vegetarian ingredients
const filterNonVegetarianIngredients = (ingredients) => {
    return ingredients.filter(ingredient => !meatKeywords.includes(ingredient.toLowerCase()));
};

// Function to clean recipe names
const cleanRecipeName = (title) => {
    return title.replace(/^How to Make\s+/i, ''); // Remove 'How to' at the beginning of the title
};

// Endpoint to fetch recipes based on ingredients, dietary restrictions, and cuisine types
app.get('/fetch-recipes/:ingredients/:diet?/:cuisine?', async (req, res) => {
    const ingredientsParam = req.params.ingredients; // Get ingredients from URL
    const dietParam = req.params.diet ? req.params.diet.toLowerCase() : undefined; // Get diet if provided
    const cuisineParam = req.params.cuisine ? req.params.cuisine.toLowerCase() : undefined; // Get cuisine if provided
    let ingredients = ingredientsParam.split(','); // Split into an array

    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({ error: 'Please provide valid ingredients.' });
    }

    // If vegetarian diet is requested, filter out non-vegetarian ingredients
    if (dietParam === 'vegetarian') {
        ingredients = filterNonVegetarianIngredients(ingredients);
    }

    if (ingredients.length === 0) {
        return res.status(400).json({ error: 'No valid vegetarian ingredients were provided.' });
    }

    const ingredientsString = ingredients.join(',');

    try {
        // Fetch recipes based on ingredients, dietary restrictions, and cuisine types
        const response = await axios.get(
            `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsString}&apiKey=${SPOONACULAR_API_KEY}` +
            `${dietParam ? `&diet=${dietParam}` : ''}` +
            `${cuisineParam ? `&cuisine=${cuisineParam}` : ''}`
        );

        if (response.data.length === 0) {
            return res.status(404).send('No recipes found.');
        }

        // Prepare output for the browser
        const detailedRecipes = await Promise.all(response.data.map(async recipe => {
            // Fetch detailed information for each recipe
            const recipeDetailResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`);
            let { title, readyInMinutes, instructions, extendedIngredients } = recipeDetailResponse.data;
            
            // Clean the recipe name (remove 'How to' or similar)
            title = cleanRecipeName(title);

            // Map ingredients
            const usedIngredients = extendedIngredients.map(ing => ing.name).join(', ');

            return `Recipe Name: ${title}\nCooking Time: ${readyInMinutes} minutes\nIngredients: ${usedIngredients}\nInstructions: ${instructions}\n\n`;
        }));

        // Filter out any null values (recipes with 'watch video')
        const filteredRecipes = detailedRecipes.filter(recipe => recipe !== null);

        if (filteredRecipes.length === 0) {
            return res.status(404).send('No suitable recipes found.');
        }

        // Join detailed recipes with double new lines for spacing
        const recipesOutput = filteredRecipes.join('\n\n');

        // Send the formatted output
        res.send(`<pre>${recipesOutput}</pre>`); // Using <pre> to maintain formatting
    } catch (error) {
        console.error('Error fetching recipes:', error.message);
        res.status(500).json({ error: 'Error fetching recipes from API.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
