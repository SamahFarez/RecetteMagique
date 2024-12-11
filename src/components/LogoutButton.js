import React from 'react';
import { useNavigate } from 'react-router-dom';

//button to logout
const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Send logout request to the backend
            const response = await fetch('https://recettemagique.onrender.com/logout', {
                method: 'POST',
                credentials: 'include', // Include cookies (session cookie)
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect user to the login page after successful logout
                navigate('/login');
            } else {
                // Show error if logout failed
                alert(data.error || 'Failed to log out');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            alert('An error occurred while logging out.');
        }
    };

    return (
        <button onClick={handleLogout}>Log Out</button>
    );
};

export default LogoutButton;