import React, { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';  // Import the LogoutButton component
import { toPng } from 'html-to-image'; // Import the html-to-image library

const Dashboard = () => {
  const [data, setData] = useState('');
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // Track the selected recipe for the popup

  useEffect(() => {
    // Fetch data directly from your backend API
    fetch('http://localhost:5000/fetch-recipes/tomato,egg,pork', {
      credentials: 'include'  // This ensures the session cookie is sent
    })
      .then(response => {
        if (response.ok) {
          return response.text();  // Convert the response to text (since you're dealing with raw text data)
        } else {
          // Handle different error codes and provide specific messages
          switch (response.status) {
            case 402:
              throw new Error('Daily API limit exceeded. Please try again later.');
            case 404:
              throw new Error('Recipes not found. Please check your ingredients or try again later.');
            case 500:
              throw new Error('Server error. Please try again.');
            default:
              throw new Error('An unexpected error occurred.');
          }
        }
      })
      .then(data => {
        setData(data);  // Set the raw data from the response
      })
      .catch(error => {
        setError(error.message);  // Use the specific error message
        console.error(error);  // Log the error for debugging purposes
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

  // Function to save modal content as an image
  const saveAsImage = () => {
    const modalContent = document.getElementById('modal-content'); // Select the modal content
    if (modalContent) {
      toPng(modalContent, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `${selectedRecipe.name}.png`; // Use the recipe name as the file name
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Failed to capture the modal content as an image:', err);
        });
    }
  };

  return (
    <div>
      <h1 className="centered-title">Dashboard</h1>

      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Grid Container */}
      <div className="text-normal-volkorn recipe-grid">
        {recipes.map((recipe, index) => (
          <div 
            key={index} 
            className="recipe-card" 
            onClick={() => setSelectedRecipe(recipe)} // Set the selected recipe for the modal
          >
            <h2>{recipe.name}</h2>
            <p><strong>Cooking Time:</strong> {recipe.cookingTime}</p>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}> {/* Close modal on overlay click */}
          <div id="modal-content" className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Prevent closing on modal content click */}
            <button className="close-button" onClick={() => setSelectedRecipe(null)}>X</button>
            <h2>{selectedRecipe.name}</h2>
            <p><strong>Cooking Time:</strong> {selectedRecipe.cookingTime}</p>
            <p><strong>Ingredients:</strong></p>
            <ul>
              {selectedRecipe.ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
              ))}
            </ul>
            <p><strong>Instructions:</strong></p>
            <div dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }} />
            
            {/* Save as Image Button */}
            <button onClick={saveAsImage} className="save-button">Save as Image</button>
          </div>
        </div>
      )}

      {/* Log out button */}
      <LogoutButton className="preference-option" /> {/* This button triggers the logout */}
    </div>
  );
};

export default Dashboard;
