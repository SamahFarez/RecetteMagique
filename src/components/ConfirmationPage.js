// src/pages/ConfirmationPage.js
import React from 'react';
import { useParams } from 'react-router-dom';

const ConfirmationPage = () => {
    const { token } = useParams();

    const confirmEmail = async () => {
        try {
            const response = await fetch(`http://localhost:5000/confirm/${token}`);
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error confirming email:', error);
        }
    };

    React.useEffect(() => {
        confirmEmail();
    }, [token]);

    return (
        <div>
            <h1>Confirming your email...</h1>
        </div>
    );
};

export default ConfirmationPage;
