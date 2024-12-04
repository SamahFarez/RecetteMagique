import React, { useState } from 'react';
import submit from '../assets/submit.png';
import '../App.css';
import Navbar from './Navbar'; // Import Navbar
import Footer from './Footer'; // Update the path if necessary

const Ingredients = () => {
  const [ingredientsList, setIngredientsList] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');

  const handleRemoveIngredient = (item) => {
    setIngredientsList(ingredientsList.filter((ing) => ing !== item));
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== '' && !ingredientsList.includes(newIngredient.trim())) {
      setIngredientsList([...ingredientsList, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleSubmit = () => {
    console.log('Available Ingredients:', ingredientsList);
    // Here you can add functionality to handle the available ingredients, e.g., send to the backend
  };

  return (
    <>
      <Navbar />
      <div className="ingredients-page">
        <div className="ingredients-content">
          <p className="text-normal">Enter the ingredients you have at home and we will take care of it!</p>
          <h1 className="title-medium">Step One: Available Ingredients</h1>

          {/* Add New Ingredient Section */}
          <div className="add-ingredient-section">
            <p className="title-small">Add New Ingredient:</p>
            <div className="add-ingredient-form">
              <input
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Enter new ingredient"
                className="ingredient-input"
              />
              <button onClick={handleAddIngredient} className="add-button">Add</button>
            </div>
          </div>

          {/* Available Ingredients List */}
          <div className="ingredients-list">
            <p className="title-small">Available Ingredients:</p>
            {ingredientsList.length > 0 ? (
              <div className="ingredients-grid">
                {ingredientsList.map((item, index) => (
                  <button
                    key={index}
                    className="ingredient-button"
                    onClick={() => handleRemoveIngredient(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : (
              <p className="no-ingredients-message">No ingredients added yet. Use the form above to add ingredients.</p>
            )}
          </div>

          {/* Submit Button at the Bottom of the Container */}
          <button className="submit-button" onClick={handleSubmit}>
            <img src={submit} alt="Submit" />
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Ingredients;
