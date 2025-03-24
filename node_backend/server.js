const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const restaurantRoutes = require("./routes/restaurantRoutes");
const modelRoutes = require("./routes/modelRoutes");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/models", modelRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the MERN API" });
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
