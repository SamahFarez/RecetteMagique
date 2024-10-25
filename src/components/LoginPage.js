import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../App.css';
import inputIcon from '../assets/input_icon.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = { email, password };

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials for cookies and sessions
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to Dashboard on successful login
        navigate('/dashboard');
      } else {
        alert(data.error); // Show error message
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('There was an error with your login.');
    }
  };

  // Prevent drag and drop
  const preventDragOver = (e) => {
    e.preventDefault();
  };

  const preventDrop = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-hero">
      <h1 className="title-big">Welcome Back!</h1>
      <p className="text-normal">
        Let us find for you the best recipes you can get with only what you have available at home.
      </p>
      <form onSubmit={handleLogin} className="login-form">
        <div className="input-group">
          <img src={inputIcon} alt="Email Icon" className="input-icon" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onDragOver={preventDragOver}
            onDrop={preventDrop}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input text-normal-volkorn"
          />
        </div>
        <div className="input-group">
          <img src={inputIcon} alt="Password Icon" className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            onDragOver={preventDragOver}
            onDrop={preventDrop}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input text-normal-volkorn"
          />
        </div>
        <button type="submit" className="login-button title-medium">Login</button>
      </form>
      {/* Signup Redirect Link */}
      <p className="signup-redirect text-normal">
        You don't have an account?{' '}
        <span 
          className="signup-link" 
          onClick={() => navigate('/signup')} // Redirect to signup page
          style={{ color: '#A98467', cursor: 'pointer' }} // Optional styling
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
