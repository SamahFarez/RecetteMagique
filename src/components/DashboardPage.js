import React, { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';  // Import the LogoutButton component
import axios from 'axios';

const Dashboard = () => {
  const [data, setData] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
  // Log the cookies to the console
  console.log('Cookies:', document.cookie);  // This will show the cookies stored in the browser

  // Fetch session data from the backend
  axios
    .get('https://recettemagique.onrender.com/session', {
      withCredentials: true,  // Ensure cookies are included in the request
    })
    .then((response) => {
      console.log('Session Data:', response.data);  // Log session data
    })
    .catch((error) => {
      console.error('Error fetching session data:', error);
    });

  // Fetch recipes
  axios
    .get('https://recettemagique.onrender.com/fetch-recipes/tomato,egg,pork', {
      withCredentials: true,
    })
    .then((response) => {
      setData(response.data);
    })
    .catch((error) => {
      setError('Error fetching data');
      console.error(error);
    });
}, []);



  // Function to parse the raw text data into an array of recipe objects
  const parseRecipes = (rawData) => {
    const recipeRegex = /Recipe Name: (.*?)\nCooking Time: (.*?)\nIngredients: (.*?)\nInstructions: (.*?)(?=Recipe Name:|$)/gs;
    const recipes = [];
    let match;

    while ((match = recipeRegex.exec(rawData)) !== null) {
      recipes.push({
        name: match[1],
        cookingTime: match[2],
        ingredients: match[3].replace(/,\s/g, ', ').split(','),
        instructions: match[4].replace(/<ol>/g, '').replace(/<\/li>/g, '').replace(/<li>/g, '<p>').replace(/<\/ol>/g, ''),
      });
    }

    return recipes;
  };

  // Parse the recipe data from raw text
  const recipes = parseRecipes(data);

  return (
    <div>
      <h1 className="centered-title">Dashboard</h1>

      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Grid Container */}
      <div className="text-normal-volkorn recipe-grid">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe-card">
            <h2>{recipe.name}</h2>
            <p><strong>Cooking Time:</strong> {recipe.cookingTime}</p>
            <p><strong>Ingredients:</strong></p>
            <ul>
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
            <p><strong>Instructions:</strong></p>
            <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
          </div>
        ))}
      </div>

      {/* Log out button */}
      <LogoutButton class="preference-option" /> {/* This button triggers the logout */}
    </div>
  );
};

export default Dashboard;
