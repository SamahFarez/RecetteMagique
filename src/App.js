import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Router, Route, and Routes
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import WhyChooseUs from "./components/WhyChooseUs";
import HowItWorks from "./components/HowItWorks";
import PopularRecipes from "./components/PopularRecipes";
import Footer from "./components/Footer";
import LoginPage from "./components/LoginPage"; // Import your LoginPage component
import SignupPage from "./components/SignupPage"; // Import your SignupPage component
import DashboardPage from "./components/DashboardPage"; // Import the DashboardPage
import DietaryPreferences from "./components/DietaryPreferences"; // Adjust the path as needed

import "./App.css";

function App() {
  return (
    <Router>
      {/* Wrap your application in Router */}
      <div className="App">
        <Navbar />
        <Routes>
          {/* Route for the main home page */}
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <WhyChooseUs />
                <HowItWorks />
                <PopularRecipes />
                <Footer />
              </>
            }
          />
          {/* Route for the login page */}
          <Route path="/login" element={<LoginPage />} />
          {/* Route for the signup page */}
          <Route path="/signup" element={<SignupPage />} />
          {/* Add the Dashboard route with the correct 'element' syntax */}
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Add the Confirmation route */}
          <Route path="/confirm/:token" element={<LoginPage />} />
          {/* Other routes */}
          <Route path="/preferences" element={<DietaryPreferences />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
