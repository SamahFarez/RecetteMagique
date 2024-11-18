import React from 'react';
import '../App.css';
import logo from '../assets/logo.png'; // Import the logo image

const Footer = () => {
  return (
    <>
      <div className="dashed-line"></div> {/* Dashed line */}
      <footer>
        <div className="footer-logo">
          <img src={logo} alt="Recette Magique Logo" />
          <p className="text-normal-volkorn">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,</p>
        </div>
        <div className="footer-links">
          <ul>
            <li><a href="#home" className="text-normal-volkorn">Home</a></li>
            <li><a href="#choose" className="text-normal-volkorn">Why Choose Us</a></li>
            <li><a href="#works" className="text-normal-volkorn">How It Works</a></li>
            <li><a href="#contact" className="text-normal-volkorn">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-contact">
          <p className="text-normal-volkorn">Contact Us</p>
          <p className="text-normal">example@example.com</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;