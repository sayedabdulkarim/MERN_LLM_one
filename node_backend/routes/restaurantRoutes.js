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

// search restaurants
router.get("/search", (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Name query parameter is required" });
    }

    // Read the JSON file synchronously
    const filePath = path.join(__dirname, "../dummyData/restaurants.json");
    const restaurantData = fs.readFileSync(filePath, "utf8");
    const restaurants = JSON.parse(restaurantData);

    // Filter restaurants by name (case-insensitive)
    const filteredRestaurants = restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(name.toLowerCase())
    );

    // Send filtered results
    res.status(200).json(filteredRestaurants);
  } catch (error) {
    console.error("Error searching restaurants:", error);
    res.status(500).json({ message: "Failed to search restaurants" });
  }
});

module.exports = router;
