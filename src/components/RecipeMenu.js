import React from "react";
import '../App.css';

const RecipePage = () => {
  const recipe = {
    title: "Japanese Sushi",
    ingredients: [
      "2 cups sushi rice",
      "2 ½ cups water",
      "2 tbsp rice vinegar",
      "1 tbsp sugar",
      "1 tsp salt",
      "4 sheets nori (seaweed)",
      "100g fresh salmon",
      "1 cucumber",
      "1 avocado",
      "Soy sauce (for dipping)",
      "Wasabi (optional)",
      "Pickled ginger (optional)"
    ],
    method: [
      "Rinse the sushi rice under cold water until the water runs clear, then cook it with water in a rice cooker or on the stove. Let the rice cool for 10 minutes.",
      "In a bowl, mix the rice vinegar, sugar, and salt, and gently fold this mixture into the rice. Allow the rice to cool completely.",
      "Slice the salmon, cucumber, and avocado into thin strips for the fillings.",
      "Lay a sheet of nori on a bamboo sushi mat with the shiny side down. Spread a thin layer of sushi rice over the nori, leaving a 1-inch border at the top. Place the sliced fish, cucumber, and avocado along the center of the rice.",
      "Carefully roll the sushi using the bamboo mat, rolling it tightly from the bottom edge. Wet the top border of the nori to seal the roll. Use a sharp, wet knife to slice the roll into bite-sized pieces. Serve with soy sauce, wasabi, and pickled ginger."
    ]
  };

  return (
    <div className="recipe-page">
      <h1 className="recipe-title">{recipe.title}</h1>
      <h2 className="section-title">Ingredients</h2>
      <ul className="ingredients-list">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="ingredient-item">{ingredient}</li>
        ))}
      </ul>
      <h2 className="section-title">Method</h2>
      <ol className="method-list">
        {recipe.method.map((step, index) => (
          <li key={index} className="method-step">{step}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecipePage;
