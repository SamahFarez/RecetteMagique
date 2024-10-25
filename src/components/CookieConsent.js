// CookieConsent.js
import React, { useState, useEffect } from 'react';
import '../App.css'; // Make sure to import the CSS for styling

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if cookies have been accepted
    const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!hasAcceptedCookies) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true'); // Store acceptance in local storage
    setIsVisible(false); // Hide the notification
  };

  const handleRejectCookies = () => {
    localStorage.setItem('cookiesAccepted', 'false'); // Store rejection in local storage
    setIsVisible(false); // Hide the notification
  };

  return (
    isVisible && (
      <div className="cookie-consent-modal">
        <div className="cookie-consent-content">
          <h2 className="title-medium">🍪 Cookie Consent 🍪</h2>
          <p className="text-normal">
            Hey there, Recipe Lover! We use cookies to sprinkle a little extra sweetness into your experience. 
            These delightful bites of data help us understand your preferences and serve up the best recipes just for you!
          </p>
          <p className="text-normal">
            By accepting cookies, you'll unlock a world of culinary inspiration, tailored just for you. </p>
          <p className="text-normal">If you prefer to skip the cookies, that’s okay too! 
            Your journey to deliciousness is still here.
          </p>
          <p className="text-normal">What will it be?</p>
          <div className="cookie-consent-buttons">
            <button onClick={handleAcceptCookies} className="text-normal-volkorn accept-button">
              Accept Cookies
            </button>
            <button onClick={handleRejectCookies} className="text-normal-volkorn reject-button">
              Reject Cookies
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CookieConsent;
