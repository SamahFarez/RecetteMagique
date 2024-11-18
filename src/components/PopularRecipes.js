import React from 'react';
import '../App.css'; // Ensure your CSS is linked correctly
import risottoImg from '../assets/risotto.png'; // Import images
import enchiladaImg from '../assets/enchiladas.png';
import greekSaladImg from '../assets/greek.png';

const PopularRecipes = () => {
  return (
    <section className="popular-recipes">
      <h2 className="section-title title-big">Popular Recipes</h2>
      
      {/* Recipe categories buttons */}
      <div className="recipe-categories">
        <button className="category-button text-normal-volkorn active">Cuisines</button>
        <button className="category-button text-normal-volkorn">Dietary Preferences</button>
        <button className="category-button text-normal-volkorn">Meal Types</button>
        <button className="category-button text-normal-volkorn">Special Diets</button>
      </div>

      {/* Recipe items grid */}
      <div className="recipe-grid">
        <div className="recipe-item">
          <img src={risottoImg} alt="Italian Risotto" className="recipe-image" />
          <p className="recipe-name text-normal-volkorn">Italian Risotto</p>
        </div>
        <div className="recipe-item">
          <img src={enchiladaImg} alt="Mexican Enchiladas" className="recipe-image" />
          <p className="recipe-name text-normal-volkorn">Mexican Enchiladas</p>
        </div>
        <div className="recipe-item">
          <img src={greekSaladImg} alt="Greek Salad" className="recipe-image" />
          <p className="recipe-name text-normal-volkorn">Greek Salad</p>
        </div>
      </div>
    </section>
  );
};

export default PopularRecipes;
