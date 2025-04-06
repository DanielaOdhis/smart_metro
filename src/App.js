import React from "react";
import Feedback from "./Pages/Feedback"; // Import the Feedback component
import Login from './Pages/Login'; // Import the Login component
import Register from './Pages/Register'; // Import the Register component
import ErrorPage from './Pages/ErrorPage'; // Import the Error Page component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BusTracking from "./Pages/BusTracking";
import About from "./Pages/About";
import ForgotPassword from "./Pages/ForgotPassword";
import Profile from "./Pages/Profile";
import Home from "./Pages/Home"

import "./App.css"; // Optional: Add global styling if needed
import AdminPage from "./Pages/Admin"; // Import the Admin Page component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/BusTracking" element={<BusTracking/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<ErrorPage />} />

      </Routes>
    </Router>
    
  );
}

export default App;
