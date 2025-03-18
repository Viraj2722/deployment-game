import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase"; // Ensure Firestore is initialized
import { useNavigate } from "react-router-dom";
import "./login.css";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [startupComplete, setStartupComplete] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));

  useEffect(() => {
    // Simulate Windows 95 startup sequence
    setTimeout(() => {
      setStartupComplete(true);
    }, 4000);
  }, []);


  const handleLoginClick = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Fetch the stored password from Firestore (Collection: password, Document: password, Field: password)
      const docRef = doc(db, "password", "password");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const storedPassword = docSnap.data().password; // Retrieve the password field

        if (password === storedPassword) {
          // alert("Login successful! 🎉");
          setPassword(""); // Clear password field after successful login
          navigate("/deployment"); // Redirect to the DeploymentMain component
        } else {
          setError("Incorrect password. Please try again.");
        }
      } else {
        setError("Password document not found.");
      }
    } catch (err) {
      console.error("Error fetching password:", err.message);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="win-desktop">
      {!startupComplete ? (
        <div className="win-startup">
          <div className="win-startup__logo-container">
            <div className="win-startup__flag-logo"></div>
            <span className="win-startup__text-logo">Windows 95</span>
          </div>
          <div className="win-startup__progress">
            <div className="win-startup__progress-bar"></div>
          </div>
        </div>
      ) : (
        <div className={`win-login ${startupComplete ? 'win-login--visible' : ''}`}>
          <div className="win-login__window">
            <div className="win-login__title-bar">
              <div className="win-login__title-left">
                <img src="/windows.png" alt="Win95" className="win-login__icon" />
                <span>Ghost Protocol - CSI </span>
              </div>
              <div className="win-login__title-buttons">
                <button className="win-login__title-btn win-login__title-btn--minimize">--</button>
                <button className="win-login__title-btn win-login__title-btn--close">X</button>
              </div>
            </div>
            <div className="win-login__content">
              <div className="win-login__header">
                <div className="win-login__header-icon-wrapper">
                  <img src="/padlock.png" alt="Login" className="win-login__header-icon win-login__header-icon--pulse" />
                </div>
                <h2 className="win-login__welcome">Welcome to Ghost Protocol Level 2</h2>
              </div>
              <div className="win-login__profile">
                <div className="win-login__avatar-container">
                  <img src="/csi-logo.png" alt="User" className="win-login__avatar-img" />
                </div>
                <p className="win-login__username">User</p>
              </div>
              <p className="win-login__instruction">Please enter your password to continue</p>
              {error && <div className="win-login__error win-login__error--shake">{error}</div>}
              <form onSubmit={handleLoginClick}>
                <div className="win-login__form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="win-login__input"
                  />
                </div>
                <div className="win-login__button-group">
                  <button type="submit" disabled={loading} className="win-login__button win-login__button--primary win-login__button--hover">
                    {loading ? 'Processing...' : 'OK'}
                  </button>
                  <button 
                    type="button" 
                    className="win-login__button win-login__button--cancel win-login__button--hover" 
                    onClick={() => { setPassword(""); setError(""); }}>
                    Cancel
                  </button>
                </div>
              </form>
              {loading && (
                <div className="win-login__loading">
                  <div className="win-login__hourglass"></div>
                  <span>Verifying password...</span>
                </div>
              )}
              <div className="win-login__tips">
                <p>Tip: Time is running up, HURRY !!!!</p>
              </div>
            </div>
            <div className="win-login__status-bar"> 
              <span className="win-login__status-message">Press OK to LOG IN</span>
              <span className="win-login__status-time">{currentTime}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;