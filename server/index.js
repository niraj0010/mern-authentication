require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");
const connectDB = require("./db");
const userRoutes = require('./routes/users');
const authRoutes = require("./routes/auth");

// Connect to database
connectDB();

// Middleware and routes setup
app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Server setup
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
