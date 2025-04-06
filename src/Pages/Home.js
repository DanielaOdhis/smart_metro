import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation

const navItems = [
    { label: "Track Bus", href: "/BusTracking" },
    { label: "Features", href: "#features" },
    { label: "Route Info", href: "#route" },
    { label: "About Us", href: "/about" },
    { label: "Feedback", href: "/feedback" },
    {label: "Profile", href: "/profile"},
  ];
  const features = [
    {
      icon: "⏰", // Clock emoji as a simple replacement
      title: "Real-Time Tracking",
      description: "Track your bus location and arrival times in real-time",
    },
    {
      icon: "📍", // Map Pin emoji
      title: "Route Planning",
      description: "Plan your journey with detailed route information",
    },
    {
      icon: "🔔", // Bell emoji
      title: "Smart Notifications",
      description: "Get alerts about delays and schedule changes",
    },
    {
      icon: "⭐", // Star emoji
      title: "Service Rating",
      description: "Rate your journey and provide feedback",
    },
  ];

const Home = () => {
    const [isOpen, setIsOpen] = useState(false)
      const navigate = useNavigate(); // React Router navigation
        // const handleNavigation = (path) => {
        //     navigate(path); // Navigate to the specified path
        //     setIsOpen(false); // Close the mobile menu
        // };

  return (
    <div className="min-h-screen bg-white">
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        background: "rgba(0, 0, 0, 0.8)", // Semi-transparent black
        padding: "10px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {/* Logo */}
        <a href="/" style={{ fontSize: "20px", fontWeight: "bold", color: "white", textDecoration: "none" }}>
          Smart Metro
        </a>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: "flex",
            gap: "15px",
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                textDecoration: "none",
                color: "white",
                fontWeight: "bold",
                padding: "8px 12px",
                borderRadius: "5px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "rgba(255, 165, 0, 0.7)")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)")}
            >
              {item.label}
            </a>
          ))}
          <button
            style={{
              padding: "8px 16px",
              background: "#ff7f00",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            
            onMouseOver={(e) => (e.target.style.background = "#e66f00")}
            onMouseOut={(e) => (e.target.style.background = "#ff7f00")}
            onClick={() => navigate("/profile")}
          >
            PROFILE
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            fontSize: "24px",
            cursor: "pointer",
            display: "none",
          }}
          className="mobile-menu-button"
        >
          ☰
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "20px",
            background: "black",
            padding: "15px",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              style={{
                color: "white",
                textDecoration: "none",
                padding: "10px",
                fontWeight: "bold",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "orange")}
              onMouseOut={(e) => (e.target.style.color = "white")}
              
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
    <section
      style={{
        position: "relative",
        padding: "80px 20px",
        backgroundImage: 'url("https://www.smetro.co.ke/assets/img/metrobus5.jpeg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
        textAlign: "center",
      }}
    >
      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      ></div>

      <div style={{ position: "relative", maxWidth: "800px", margin: "auto" }}>
        {/* Hero Title */}
        <h1 style={{ fontSize: "40px", fontWeight: "bold", marginBottom: "20px", color: "orange" }}>
          Smart Metro System
        </h1>

        {/* Hero Subtitle */}
        <p
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            color: "black",
            padding: "15px",
            borderRadius: "8px",
            fontSize: "18px",
            marginBottom: "30px",
          }}
        >
          Enhancing passenger mobility and convenience along the Nairobi-Juja route (Thika Road)
          with real-time tracking and smart features.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>

          <button  style={{
              background: "#ff7f00",
              color: "white",
              padding: "12px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }} onClick={() => navigate("/BusTracking")}>Track Your Bus Now</button>

          <button
            style={{
              background: "transparent",
              border: "2px solid white",
              color: "white",
              padding: "12px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Learn More
          </button>
        </div>

        {/* Service Request Form */}
        <div
          style={{
            background: "white",
            color: "black",
            padding: "20px",
            borderRadius: "8px",
            marginTop: "40px",
            textAlign: "left",
          }}
        >
          <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}>NEED HELP?</h3>

          <form>
            {/* Special Service Requests */}
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "14px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>
                Special Service Requests
              </label>
              <textarea
                rows="3"
                placeholder="E.g., Need extra luggage space, assistance for elderly"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              style={{
                width: "100%",
                background: "#ff7f00",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </section>
      <section id="features" style={{ padding: "40px", background: "#f8f9fa" }}>
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1a202c" }}>
          Smart Features for Smart Travel
        </h2>
        <p style={{ fontSize: "16px", color: "#4a5568", maxWidth: "600px", margin: "auto" }}>
          Experience seamless travel with our innovative features designed to
          make your journey comfortable and efficient.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", maxWidth: "800px", margin: "auto" }}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              textAlign: "center",
              transition: "transform 0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>{feature.icon}</div>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1a202c" }}>
              {feature.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#4a5568" }}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
    <section id="route" style={{ padding: "40px", background: "white" }}>
      <div style={{ maxWidth: "900px", margin: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "center" }}>
        
        {/* Text Content */}
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1a202c", marginBottom: "20px" }}>
            Nairobi - Juja Route
          </h2>
          <p style={{ fontSize: "16px", color: "#4a5568", marginBottom: "20px" }}>
            Our smart metro service operates along the busy Thika Road corridor,
            connecting Nairobi CBD to Juja with multiple stops along the way.
          </p>

          {/* Key Stops */}
          <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1a202c", marginBottom: "10px" }}>
              Key Stops
            </h3>
            <ul style={{ listStyle: "none", paddingLeft: "0", color: "#4a5568" }}>
              <li>• Nairobi CBD Terminal</li>
              <li>• Ngara</li>
              <li>• Muthaiga</li>
              <li>• Kasarani</li>
              <li>• Ruiru</li>
              <li>• Juja Town</li>
            </ul>
          </div>
        </div>

        {/* Image */}
        <div style={{ position: "relative", textAlign: "center" }}>
          <img
            src="https://images.unsplash.com/photo-1577086664693-894d8405334a"
            alt="Nairobi-Juja Route Map"
            style={{ width: "100%", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
          />
        </div>
      </div>
    </section>
    <section id="feedback" style={{ padding: "40px", background: "#f8f9fa" }}>
      <div style={{ maxWidth: "600px", margin: "auto", textAlign: "center" }}>
        
        {/* Header */}
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1a202c", marginBottom: "10px" }}>
          Get in Touch
        </h2>
        <p style={{ fontSize: "16px", color: "#4a5568", marginBottom: "20px" }}>
          We value your feedback! Let us know how we can improve your travel experience.
        </p>

        {/* Form Container */}
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
          <form style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            {/* Name Input */}
            <div>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "#4a5568", display: "block", marginBottom: "5px" }}>
                Name
              </label>
              <input type="text" placeholder="Your name" 
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
            </div>

            {/* Email Input */}
            <div>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "#4a5568", display: "block", marginBottom: "5px" }}>
                Email
              </label>
              <input type="email" placeholder="Your email"
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }} />
            </div>

            {/* Message Input */}
            <div>
              <label style={{ fontSize: "14px", fontWeight: "bold", color: "#4a5568", display: "block", marginBottom: "5px" }}>
                Message
              </label>
              <textarea placeholder="Your feedback or message"
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", minHeight: "120px" }}>
              </textarea>
            </div>

            {/* Submit Button */}
            <button type="submit"
              style={{ width: "100%", background: "#ff7f00", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Send Message
            </button>

          </form>
        </div>

      </div>
    </section>
    </div>
  );
};

export default Home;
