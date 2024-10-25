import React from 'react';
import '../App.css';
import logo from '../assets/logo.png'; // Import the image
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Navbar = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle logo click
  const handleLogoClick = () => {
    navigate('/'); // Redirect to the index/home page
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="Logo" /> {/* Use the imported image */}
      </div>
      <ul className="nav-links">
        <li className="text-normal-volkorn"><a href="#menu">Menu</a></li>
        <li className="text-normal-volkorn"><a href="#about">About</a></li>
        <li className="text-normal-volkorn"><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
