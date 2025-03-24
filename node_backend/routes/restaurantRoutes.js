const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Get all restaurants
router.get("/", (req, res) => {
  try {
    // Read the JSON file synchronously
    const filePath = path.join(__dirname, "../dummyData/restaurants.json");
    const restaurantData = fs.readFileSync(filePath, "utf8");
    const restaurants = JSON.parse(restaurantData);

    // Send JSON response
    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ message: "Failed to fetch restaurants data" });
  }
});

module.exports = router;
