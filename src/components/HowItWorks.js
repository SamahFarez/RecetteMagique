import React from 'react';
import '../App.css'; // Ensure your CSS is linked correctly
import ingredientsImg from '../assets/ingredients.png'; // Import images
import generateImg from '../assets/generate.png';
import recipeImg from '../assets/recipe.png';

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <h2 className="title-big">How It Works</h2>
      <div className="steps">
        <div className="step">
          <img src={ingredientsImg} alt="Available Ingredients" className="step-image" />
          <p className="step-title text-normal-volkorn">Available Ingredients</p>
        </div>
        <div className="step">
          <img src={recipeImg} alt="Food Preferences" className="step-image" />
          <p className="step-title text-normal-volkorn">Food Preferences</p>
        </div>
        <div className="step">
          <img src={generateImg} alt="AI Recipes" className="step-image" />
          <p className="step-title text-normal-volkorn">AI Generated Recipes</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
