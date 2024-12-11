import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import '../App.css'; // Assurez-vous que votre CSS est correctement lié
import inputIcon from '../assets/input_icon.png'; // Ajustez le chemin si nécessaire

const SignupPage = () => {
  // Hooks d'état pour gérer les données du formulaire et la gestion des erreurs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialiser useNavigate

  // Gérer la soumission du formulaire d'inscription
  const handleSignup = async (e) => {
    e.preventDefault();

    // Effacer les messages d'erreur précédents
    setErrorMessage('');

    // Vérifier si les mots de passe correspondent
    if (password !== confirmedPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    // Rassembler les données de l'utilisateur à envoyer au backend
    const userData = {
      fullName,
      email,
      password,
    };

    setIsLoading(true); // Définir l'état de chargement sur true

    try {
      // Envoyer la requête POST au serveur pour créer un nouvel utilisateur
      const response = await fetch('https://recettemagique.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Inclure les cookies/sessions si nécessaire
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Inscription réussie, rediriger vers la page de connexion
        navigate('/login');
      } else {
        // Gérer les erreurs comme un utilisateur déjà existant ou d'autres erreurs de validation
        setErrorMessage(data.message || 'L\'inscription a échoué. Veuillez réessayer.');
      }
    } catch (error) {
      // Gérer les erreurs réseau ou serveur
      console.error('Erreur lors de l\'inscription :', error);
      setErrorMessage('Il y a eu une erreur lors de la connexion au serveur.');
    } finally {
      setIsLoading(false); // Fin de l'état de chargement
    }
  };

  // Empêcher le comportement de glisser-déposer sur les champs de saisie
  const preventDragOver = (e) => e.preventDefault();
  const preventDrop = (e) => e.preventDefault();

  return (
    <div className="signup-hero">
      <h1 className="title-big">Bienvenue chez nous!</h1>
      <p className="text-normal">
        Laissez-nous trouver pour vous les meilleures recettes que vous pouvez préparer avec ce que vous avez à la maison.
      </p>
      <form onSubmit={handleSignup} className="signup-form">
        {/* Champ de saisie pour le nom complet */}
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
        
        {/* Champ de saisie pour l'email */}
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
        
        {/* Champ de saisie pour le mot de passe */}
        <div className="input-group">
          <img src={inputIcon} alt="Icône Mot de passe" className="input-icon" />
          <input 
            type="password" 
            placeholder="Mot de Passe" 
            value={password}
            onDragOver={preventDragOver}
            onDrop={preventDrop}
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="signup-input text-normal-volkorn" 
          />
        </div>
        
        {/* Champ de saisie pour la confirmation du mot de passe */}
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

        {/* Afficher le message d'erreur si nécessaire */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Bouton de soumission */}
        <button type="submit" className="signup-button title-medium" disabled={isLoading}>
          {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
        </button>
      </form>

      {/* Lien pour se rediriger vers la page de connexion si l'utilisateur a déjà un compte */}
      <p className="login-redirect text-normal">
        Vous avez déjà un compte ?{' '}
        <span 
          className="login-link" 
          onClick={() => navigate('/login')} 
          style={{ color: '#A98467', cursor: 'pointer' }}
        >
          Se connecter
        </span>
      </p>
    </div>
  );
};

export default SignupPage;
