import React, { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';  // Import the LogoutButton component

const Dashboard = () => {
  const [data, setData] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data directly from your backend API
    fetch('https://recettemagique.onrender.com/fetch-recipes/tomato/vegetarian')  // Update the URL to match your tested endpoint
      .then(response => {
        if (response.ok) {
          return response.text();  // Convert the response to text (since you're dealing with raw text data)
        } else {
          // Handle different error codes and provide specific messages
          switch (response.status) {
            case 402:
              throw new Error('Daily API limit exceeded. Please try again later.');
            case 404:
              throw new Error('Recipes not found. Please check your ingredients or try again later.');
            case 500:
              throw new Error('Server error. Please try again.');
            default:
              throw new Error('An unexpected error occurred.');
          }
        }
      })
      .then(data => {
        setData(data);  // Set the raw data from the response
      })
      .catch(error => {
        setError(error.message);  // Use the specific error message
        console.error(error);  // Log the error for debugging purposes
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Display error message if any */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display the raw data received from the API */}
      <h2>Raw Recipe Data</h2>
      <pre>{data}</pre>  {/* Output the raw data directly */}
      
      {/* Log out button */}
      <LogoutButton /> {/* This button triggers the logout */}
    </div>
  );
};

export default Dashboard;