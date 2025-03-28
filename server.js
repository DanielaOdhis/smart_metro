const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 5000;
const ORS_API_KEY = process.env.ORS_API_KEY; // OpenRouteService API Key

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

// Define routes
const routes = {
    "Juja-Nairobi": { start: { lat: -1.1278, lng: 36.9707 }, end: { lat: -1.286389, lng: 36.817223 } },
    "Nairobi-Juja": { start: { lat: -1.286389, lng: 36.817223 }, end: { lat: -1.1278, lng: 36.9707 } }
};

// Store bus routes & positions
const busRoutes = {};
const busPositions = {};

// Fetch route from OpenRouteService
const getRoute = async (start, end) => {
    try {
        const response = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
            { coordinates: [[start.lng, start.lat], [end.lng, end.lat]] },
            { headers: { Authorization: ORS_API_KEY } }
        );

        if (response.data.features.length > 0) {
            return response.data.features[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
        }
    } catch (error) {
        console.error("❌ Error fetching route:", error);
    }
    return [];
};

// Function to update bus locations step-by-step
const updateBusLocations = () => {
    db.query("SELECT id, bus_number, step_index FROM buses WHERE status = 'active'", async (err, buses) => {
        if (err) {
            console.error("❌ Error fetching buses:", err);
            return;
        }

        const updatedBuses = [];

        for (const bus of buses) {
            const busId = bus.id;
            let routeKey = bus.bus_number.includes("Juja") ? "Juja-Nairobi" : "Nairobi-Juja";
            const { start, end } = routes[routeKey];

            if (!busRoutes[busId]) {
                busRoutes[busId] = await getRoute(start, end);
                busPositions[busId] = bus.step_index || 0;
            }

            const route = busRoutes[busId];

            if (route.length > 0 && busPositions[busId] < route.length - 1) {
                busPositions[busId]++;
                const nextStop = route[busPositions[busId]];

                db.query(
                    "UPDATE buses SET current_lat = ?, current_lng = ?, step_index = ? WHERE id = ?",
                    [nextStop.lat, nextStop.lng, busPositions[busId], busId]
                );

                updatedBuses.push({
                    id: busId,
                    bus_number: bus.bus_number,
                    current_lat: nextStop.lat,
                    current_lng: nextStop.lng,
                    status: "active",
                });

            } else {
                db.query(
                    "UPDATE buses SET current_lat = ?, current_lng = ?, step_index = 0 WHERE id = ?",
                    [start.lat, start.lng, busId]
                );

                busRoutes[busId] = await getRoute(start, end);
                busPositions[busId] = 0;

                updatedBuses.push({
                    id: busId,
                    bus_number: bus.bus_number,
                    current_lat: start.lat,
                    current_lng: start.lng,
                    status: "active",
                });
            }
        }

        if (updatedBuses.length > 0) {
            io.emit("busUpdate", updatedBuses);
        }
    });
};

// Move bus step-by-step every 5 seconds
setInterval(updateBusLocations, 5000);

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
  
// Start the server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
