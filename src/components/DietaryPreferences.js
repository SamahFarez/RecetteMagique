import React, { useState } from "react";
import "../App.css"; // Assuming shared styles
import { useNavigate } from "react-router-dom";

const DietaryPreferences = () => {
  const [dietType, setDietType] = useState("");
  const navigate = useNavigate();

  const handleDietSelection = (type) => {
    setDietType(type);
  };

  const handleProceed = async () => {
    console.log("Selected diet type:", dietType);

    try {
      const response = await fetch('https://recettemagique.onrender.com/api/save-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dietType }),
        credentials: 'include', // Send cookies (session info)
      });

      const textResponse = await response.text();
      console.log("Response text:", textResponse);

      const data = JSON.parse(textResponse);

      if (response.ok) {
        console.log("Diet preference saved successfully!");
        navigate("/dashboard");
      } else {
        alert("Error saving preference: " + data.error);
      }
    } catch (error) {
      console.error("Error saving preference:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div className="dietary-preferences-page">
      <h1 className="title-big">Préférences Alimentaires</h1>
      <p className="text-normal">
        Avant de commencer, veuillez indiquer votre type de régime alimentaire.
      </p>

      <div className="diet-options">
        {[
          "Végétalien (Vegan)",
          "Végétarien",
          "Pesco-végétarien",
          "Omnivore",
          "Sans Gluten",
          "Sans Produits Laitiers",
          "Sans Noix",
          "Sans Soja",
          "Sans Œufs",
          "Halal"
        ].map((type) => (
          <button
            key={type}
            className={`preference-option text-normal-volkorn ${
              dietType === type ? "selected" : ""
            }`}
            onClick={() => handleDietSelection(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <button className="proceed-button text-normal-volkorn" onClick={handleProceed}>
        Continuer
      </button>
    </div>
  );
};

export default DietaryPreferences;
