const express = require('express'); // Express framework for handling HTTP requests and routing
const mysql = require('mysql2'); // MySQL database driver for Node.js
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing (CORS)
const dotenv = require('dotenv'); // Loads environment variables from a .env file
const http = require('http'); // Built-in Node.js module to create an HTTP server
const socketIo = require('socket.io'); // Library for real-time, bidirectional communication via WebSockets
const axios = require('axios'); // HTTP client for making API requests
const bcrypt = require("bcryptjs"); // Library for hashing passwords securely
const jwt = require("jsonwebtoken"); // Library for generating and verifying JSON Web Tokens (JWTs)
const bodyParser = require("body-parser"); // Middleware for parsing incoming JSON request bodies
const nodemailer = require('nodemailer');

dotenv.config();

// Initialize Express App
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 5000;
const ORS_API_KEY = process.env.ORS_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL Database');
});

const router = express.Router();
router.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    // Step 1: Check if the email exists in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Server error. Please try again." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No account found with that email." });
        }

        // Step 2: Generate a unique token and expiration time (1 hour)
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        // Step 3: Update the user's record with the reset token and expiry
        db.query(
            'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE email = ?',
            [resetToken, resetExpires, email],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Error updating token." });
                }

                // Step 4: Send the password reset link to the user via email
                const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions = {
                    to: email,
                    from: 'no-reply@smartmetro.com',
                    subject: 'Password Reset Request',
                    text: `To reset your password, click the following link: ${resetUrl}`
                };

                transporter.sendMail(mailOptions, (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error sending email." });
                    }

                    res.status(200).json({ message: "Password reset link sent to your email." });
                });
            }
        );
    });
});

module.exports = router;
// Middleware to check if the user is authenticated
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Get token from the Authorization header
    if (!token) {
      return res.status(401).json({ message: 'Access denied' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = decoded; // Add decoded user info to the request object
      next();
    });
  };
  
  // GET /profile - Fetch user profile data
  router.get('/profile', authenticateToken, (req, res) => {
    const userId = req.user.id; // Get the user ID from the JWT token
  
    const query = 'SELECT name, email, profile_picture FROM users WHERE id = ?';
    db.execute(query, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(results[0]); // Return the user's profile data
    });
  });
  
// Define routes
const routes = {
    "Juja-Nairobi": { 
        start: { lat: -1.1016, lng: 37.0144 }, 
        end: { lat: -1.286389, lng: 36.817223 } 
    },
    "Nairobi-Juja": { 
        start: { lat: -1.286389, lng: 36.817223 }, 
        end: { lat: -1.1016, lng: 37.0144 } 
    }
};

// Store bus data
const busData = {};

// Fetch route from OpenRouteService
const getRoute = async (start, end) => {
    try {
        const response = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
            { coordinates: [[start.lng, start.lat], [end.lng, end.lat]] },
            { headers: { Authorization: ORS_API_KEY } }
        );

        if (response.data?.features?.length > 0) {
            return response.data.features[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
        }
        console.error("❌ ORS API returned no route data");
        return null;
    } catch (error) {
        console.error("❌ Error fetching route:", error.response?.data || error.message);
        return null;
    }
};

// Initialize bus data structure
const initializeBus = (busId) => {
    if (!busData[busId]) {
        busData[busId] = {
            route: null,
            position: 0,
            smoothingBuffer: [],
            maxBufferSize: 5,
            lastUpdate: Date.now()
        };
    }
};

// Calculate average position from buffer
const getAveragePosition = (positions) => {
    if (positions.length === 0) return null;
    
    const sum = positions.reduce((acc, pos) => ({
        lat: acc.lat + pos.lat,
        lng: acc.lng + pos.lng
    }), { lat: 0, lng: 0 });

    return {
        lat: sum.lat / positions.length,
        lng: sum.lng / positions.length
    };
};

// Update bus locations with smooth movement
const updateBusLocations = () => {
    db.query("SELECT id, bus_number FROM buses WHERE status = 'active'", async (err, buses) => {
        if (err) {
            console.error("❌ Error fetching buses:", err);
            return;
        }

        const updatedBuses = [];
        const now = Date.now();

        for (const bus of buses) {
            const busId = bus.id;
            initializeBus(busId);
            const busInfo = busData[busId];
            
            // Determine route direction
            const routeKey = bus.bus_number.includes("Juja") ? "Juja-Nairobi" : "Nairobi-Juja";
            const { start, end } = routes[routeKey];

            // Fetch route if not available
            if (!busInfo.route) {
                busInfo.route = await getRoute(start, end);
                if (!busInfo.route) continue;
                busInfo.position = 0;
                console.log(`✅ Fetched route for ${bus.bus_number}`);
            }

            // Calculate movement based on time delta for consistent speed
            const deltaTime = now - busInfo.lastUpdate;
            busInfo.lastUpdate = now;
            
            // Adjust this value to control bus speed (higher = faster)
            const movementFactor = 0.00002 * deltaTime;
            
            // Update position
            busInfo.position = (busInfo.position + movementFactor) % busInfo.route.length;
            
            // Get current and next points
            const currentIdx = Math.floor(busInfo.position);
            const nextIdx = (currentIdx + 1) % busInfo.route.length;
            const progress = busInfo.position % 1;
            
            // Interpolate position
            const currentPoint = busInfo.route[currentIdx];
            const nextPoint = busInfo.route[nextIdx];
            
            const smoothLat = currentPoint.lat + progress * (nextPoint.lat - currentPoint.lat);
            const smoothLng = currentPoint.lng + progress * (nextPoint.lng - currentPoint.lng);
            
            // Add to smoothing buffer
            busInfo.smoothingBuffer.push({
                lat: smoothLat,
                lng: smoothLng,
                timestamp: now
            });
            
            // Remove old positions from buffer
            busInfo.smoothingBuffer = busInfo.smoothingBuffer
                .filter(pos => now - pos.timestamp < 1000)
                .slice(-busInfo.maxBufferSize);
            
            // Get smoothed position
            const avgPos = getAveragePosition(busInfo.smoothingBuffer);
            if (!avgPos) continue;
            
            // Update database
            db.query(
                "UPDATE buses SET current_lat = ?, current_lng = ? WHERE id = ?",
                [avgPos.lat, avgPos.lng, busId],
                (err) => {
                    if (err) console.error(`❌ Error updating bus ${busId}:`, err);
                }
            );

            updatedBuses.push({
                id: busId,
                bus_number: bus.bus_number,
                current_lat: avgPos.lat,
                current_lng: avgPos.lng,
                status: "active"
            });
        }

        if (updatedBuses.length > 0) {
            io.emit("busUpdate", updatedBuses);
        }
    });
};

// Update buses every 100ms for smooth movement
setInterval(updateBusLocations, 100);

// API Endpoint to fetch all active buses
app.get('/api/buses', (req, res) => {
    db.query("SELECT * FROM buses WHERE status = 'active'", (err, results) => {
        if (err) {
            console.error("❌ Error fetching buses:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results);
    });
});

// WebSocket connection
io.on("connection", (socket) => {
    console.log("🔗 New WebSocket connection");

    // Send current buses on new connection
    db.query("SELECT * FROM buses WHERE status = 'active'", (err, results) => {
        if (!err) {
            socket.emit("busUpdate", results);
        }
    });

    // Emit bus updates every 5 seconds for this client
    const busUpdateInterval = setInterval(() => {
        db.query("SELECT * FROM buses WHERE status = 'active'", (err, results) => {
            if (!err) {
                socket.emit("busUpdate", results);
            }
        });
    }, 5000);

    // Cleanup on disconnect
    socket.on("disconnect", () => {
        console.log("❌ WebSocket disconnected");
        clearInterval(busUpdateInterval);
    });
});

// Register User
app.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error registering user" });
      }
      res.status(201).json({ message: "User registered successfully" });
    });
  });

  // Login User
  app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "Error logging in" });

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, "secretkey", { expiresIn: "1h" });

      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  });

  // Feedback Submission Endpoint
app.post("/feedback", (req, res) => {
    const { category, message, contact } = req.body;
    
    if (!category || !message) {
        return res.status(400).json({ error: "Category and message are required" });
    }

    const sql = "INSERT INTO feedback (category, message, contact) VALUES (?, ?, ?)";
    db.query(sql, [category, message, contact], (err, result) => {
        if (err) {
            console.error("❌ Error inserting feedback:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(201).json({ message: "Feedback submitted successfully" });
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
