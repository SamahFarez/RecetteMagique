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
                credentials: 'include',
                body: JSON.stringify(userData),

            });

            const data = await response.json();

            if (response.ok) {
                // Redirect user if login is successful
                if (data.redirectUrl) {
                    navigate(data.redirectUrl);
                }
            } else {
                alert(data.error); // Display error message from backend
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred while logging in.');
        }
    };

    return (
        <div className="login-hero">
            <h1 className="title-big">Bienvenue à nouveau !</h1>
            <p className="text-normal">
                Laissez-nous trouver pour vous les meilleures recettes que vous pouvez réaliser avec seulement ce que vous avez à la maison.
            </p>
            <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                    <img src={inputIcon} alt="Icône Email" className="input-icon" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="login-input text-normal-volkorn"
                    />
                </div>
                <div className="input-group">
                    <img src={inputIcon} alt="Icône Mot de Passe" className="input-icon" />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input text-normal-volkorn"
                    />
                </div>

                {/* reCAPTCHA component removed */}
                
                <button type="submit" className="login-button title-medium">Se connecter</button>
            </form>
            <p className="signup-redirect text-normal">
                Vous n'avez pas de compte ?{' '}
                <span
                    className="signup-link"
                    onClick={() => navigate('/signup')}
                    style={{ color: '#A98467', cursor: 'pointer' }}
                >
                    Inscrivez-vous
                </span>
            </p>
        </div>
    );
};

export default LoginPage;
