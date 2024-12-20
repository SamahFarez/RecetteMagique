import React from 'react';
import '../App.css';
import logo from '../assets/logo.png'; // Importer l'image
import { useNavigate } from 'react-router-dom'; // Importer useNavigate

const Navbar = () => {
  const navigate = useNavigate(); // Initialiser useNavigate

  // Fonction pour gérer le clic sur le logo
  const handleLogoClick = () => {
    navigate('/'); // Rediriger vers la page d'accueil
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="Logo" /> {/* Utiliser l'image importée */}
      </div>
      <ul className="nav-links">
        <li className="text-normal-volkorn"><a href="#menu">Menu</a></li>
        <li className="text-normal-volkorn"><a href="#about">À propos</a></li>
        <li className="text-normal-volkorn"><a href="#contact">Contact</a></li>
        <li>
                        <div class="text-light" id="google_translate_element"></div>
                    </li>
      </ul>
    </nav>
  );
};

export default Navbar;
