import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Import BrowserRouter and Routes

import LoginPage from "./LoginPage"; // Import LoginPage
import ErrorPage from "./ErrorPage"; // Import ErrorPage (this is for the error page)
import Win95Terminal from "./Win95Terminal";
import Windows95Matrix from "./Windows95Matrix";
import DeploymentMain from "./DeploymentMain";
import "./DeploymentMain.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} /> 
        <Route path="/error" element={<ErrorPage />} /> 
        <Route path="/Win" element={<Win95Terminal/>} />
        <Route path="/matrix" element={<Windows95Matrix/>} />
        <Route path="/deployment" element={<DeploymentMain/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
