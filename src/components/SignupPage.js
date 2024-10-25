import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../App.css'; // Ensure you import the App.css file
import inputIcon from '../assets/input_icon.png'; // Adjust the path as needed

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignup = async (e) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorMessage('');

    // Validate password confirmation
    if (password !== confirmedPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const userData = {
      fullName,
      email,
      password,
    };

    setIsLoading(true); // Start loading state

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials for cookies and sessions
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful signup
        navigate('/dashboard'); // Redirect to the dashboard after successful signup
      } else {
        // Handle backend errors (e.g., user already exists, validation errors)
        setErrorMessage(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      // Handle network or server errors
      console.error('Error during signup:', error);
      setErrorMessage('There was an error connecting to the server.');
    } finally {
      setIsLoading(false); // End loading state
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
    <div className="signup-hero">
      <h1 className="title-big">Welcome With Us!</h1>
      <p className="text-normal">
        Let us find for you the best recipes you can get with only what you have available at home.
      </p>
      <form onSubmit={handleSignup} className="signup-form">
        <div className="input-group">
          <img src={inputIcon} alt="Full Name Icon" className="input-icon" />
          <input 
            type="text" 
            placeholder="Full Name" 
            value={fullName}
            onDragOver={preventDragOver}
            onDrop={preventDrop}
            onChange={(e) => setFullName(e.target.value)} 
            required 
            className="signup-input text-normal-volkorn" 
          />
        </div>
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
            className="signup-input text-normal-volkorn" 
          />
        </div>
        <div className="input-group">
          <img src={inputIcon} alt="Password Icon" className="input-icon" />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onDragOver={preventDragOver}
            onDrop={preventDrop}
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="signup-input text-normal-volkorn" 
          />
        </div>
        <div className="input-group">
          <img src={inputIcon} alt="Confirm Password Icon" className="input-icon" />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmedPassword}
            onDragOver={preventDragOver}
            onDrop={preventDrop}
            onChange={(e) => setConfirmedPassword(e.target.value)} 
            required 
            className="signup-input text-normal-volkorn" 
          />
        </div>
        
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="signup-button title-medium" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
