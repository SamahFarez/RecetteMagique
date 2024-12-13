import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; 
import inputIcon from '../assets/input_icon.png';

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [dietPreference, setDietPreference] = useState('None'); // New state for diet preference
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmedPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    if (passwordStrength < 4) {
      setErrorMessage('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
      return;
    }

    const userData = {
      fullName,
      email,
      password,
      dietPreference, // Include diet preference in signup data
    };

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setErrorMessage(data.message || 'L\'inscription a échoué. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      setErrorMessage('Il y a eu une erreur lors de la connexion au serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  const preventDragOver = (e) => e.preventDefault();
  const preventDrop = (e) => e.preventDefault();

  return (
    <div className="signup-hero">
      <h1 className="title-big">Bienvenue chez nous!</h1>
      <form onSubmit={handleSignup} className="signup-form">
        {/* Full Name Input */}
        <div className="input-group">
          <img src={inputIcon} alt="Icône Nom Complet" className="input-icon" />
          <input 
            type="text" 
            placeholder="Nom Complet" 
            value={fullName}
            onDragOver={preventDragOver}
            onDrop={preventDrop}
            onChange={(e) => setFullName(e.target.value)} 
            required 
            className="signup-input text-normal-volkorn" 
          />
        </div>

        {/* Email Input */}
        <div className="input-group">
          <img src={inputIcon} alt="Icône Email" className="input-icon" />
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

        {/* Password Input */}
        <div className="input-group">
          <img src={inputIcon} alt="Icône Mot de passe" className="input-icon" />
          <input 
            type="password" 
            placeholder="Mot de Passe" 
            value={password}
            onDragOver={preventDragOver}
            onDrop={preventDrop}
            onChange={handlePasswordChange} 
            required 
            className="signup-input text-normal-volkorn" 
          />
          <div className="password-strength-meter">
            <progress value={passwordStrength} max={5}></progress>
            <span className="password-strength-label">
              {passwordStrength === 0 ? 'Très faible' : 
               passwordStrength === 1 ? 'Faible' : 
               passwordStrength === 2 ? 'Moyenne' : 
               passwordStrength === 3 ? 'Bonne' : 
               'Très forte'}
            </span>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="input-group">
          <img src={inputIcon} alt="Icône Confirmer le mot de passe" className="input-icon" />
          <input 
            type="password" 
            placeholder="Confirmer le Mot de Passe" 
            value={confirmedPassword}
            onDragOver={preventDragOver}
            onDrop={preventDrop}
            onChange={(e) => setConfirmedPassword(e.target.value)} 
            required 
            className="signup-input text-normal-volkorn" 
          />
        </div>

        {/* Diet Preference Dropdown */}
        <div className="input-group">
          <label htmlFor="diet-preference" className="text-normal-volkorn">Préférence Alimentaire</label>
          <select
            id="diet-preference"
            value={dietPreference}
            onChange={(e) => setDietPreference(e.target.value)}
            className="signup-input text-normal-volkorn"
          >
            <option value="None">Aucune</option>
            <option value="Vegetarian">Végétarien</option>
            <option value="Vegan">Végétalien</option>
            <option value="Pescatarian">Pescatarien</option>
            <option value="Halal">Halal</option>
            <option value="Kosher">Kasher</option>
          </select>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="submit" className="signup-button title-medium" disabled={isLoading}>
          {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
