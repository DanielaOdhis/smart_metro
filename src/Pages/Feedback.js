import React, { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaPhone, FaClipboardList, FaExclamationCircle, FaCheckCircle, FaClock, FaBus, FaStopCircle } from "react-icons/fa";
import "./Feedback.css";
import {Link} from "react-router-dom";

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    category: "Complaint",
    message: "",
    contact: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/feedback", feedback);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return (
    <div className="feedback-container">
      <section className="frame-2-3537 pos-abs">
        <div className="smart-metro-3538 pos-abs">
          <span className="smart-metro-3538-0">SMART</span>
          <span className="smart-metro-3538-2"> METRO</span>
        </div>
        <div className="home-tracking-a-3539 pos-abs">
          <span className="home-tracking-a-3539-0">
            <Link to="/" className="nav-link">Home</Link> &nbsp;&nbsp;
            <Link to="/BusTracking" className="nav-link">Tracking</Link> &nbsp;&nbsp;
            <Link to="/about" className="nav-link">About</Link> &nbsp;&nbsp;
            <Link to="/feedback" className="nav-link">Feedback</Link>
          </span>
        </div>
      </section>
      <h2 className="header">Passenger Feedback</h2>
      <p className="sub-header">Share your complaints, suggestions, or report any issues.</p>
      {submitted ? (
        <div className="success-message">
          <FaCheckCircle className="success-icon" /> Thank you for your feedback!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="feedback-form">
          <label>Category</label>
          <div className="input-group">
            <FaClipboardList className="input-icon" />
            <select name="category" value={feedback.category} onChange={handleChange}>
              <option>Complaint</option>
              <option>Suggestion</option>
              <option>Report an Issue</option>
              <option>Other</option>
            </select>
          </div>
          <label>Message</label>
          <div className="input-group">
            <FaExclamationCircle className="input-icon" />
            <textarea
              name="message"
              value={feedback.message}
              onChange={handleChange}
              placeholder="Describe your issue or suggestion"
              required
            ></textarea>
          </div>
          <label>Contact (Optional)</label>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="text"
              name="contact"
              value={feedback.contact}
              onChange={handleChange}
              placeholder="Email or Phone (optional)"
            />
          </div>
          <button type="submit" className="submit-btn">Submit Feedback</button>
        </form>
      )}

      <div className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <details>
          <summary><FaClock className="faq-icon" /> How can I check the bus schedule?</summary>
          <p>Visit our website, app, or call our customer service for updated schedules.</p>
        </details>
        <details>
          <summary><FaBus className="faq-icon" /> What happens if my bus is delayed?</summary>
          <p>We will notify you via SMS or email. You can also track your bus in real-time using our app.</p>
        </details>
        <details>
          <summary><FaBus className="faq-icon" /> Do you have night buses?</summary>
          <p>Yes, we have overnight services on selected routes. Check our schedule for details.</p>
        </details>
        <details>
          <summary><FaStopCircle className="faq-icon" /> Can I request a stop at a different location?</summary>
          <p>Buses stop only at designated points for safety and regulatory reasons.</p>
        </details>
      </div>

      <div className="support-contacts">
        <h3>Support Contacts</h3>
        <p><FaEnvelope className="contact-icon" /> Email: support@company.com</p>
        <p><FaPhone className="contact-icon" /> Phone: +254 700 123 456</p>
      </div>
    </div>
  );
};

export default Feedback;