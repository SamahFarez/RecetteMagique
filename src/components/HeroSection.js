// HeroSection.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../App.css'; // Ensure you import the App.css file
import CookieConsent from './CookieConsent'; // Adjust the import path as necessary

const HeroSection = () => {
  return (
    <div className="hero">
      <h1 className="title-big">Find Delicious Recipes with What You Have at Home</h1>
      <p className="text-normal">Let us find for you the best recipes you can get with only what you have available at home</p>
      <Link to="/login"> {/* Use Link to navigate */}
        <button className="start title-medium">Get Your Recipe</button>
      </Link>
      <CookieConsent /> {/* Add the CookieConsent component here */}
    </div>
  );
};

export default HeroSection;
