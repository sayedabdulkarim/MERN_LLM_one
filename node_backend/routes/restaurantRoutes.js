const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const axios = require("axios"); // Add axios for making requests to the LLM endpoint

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

// search restaurants with LLM
router.get("/search-llm", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    // Read the JSON file synchronously
    const filePath = path.join(__dirname, "../dummyData/restaurants.json");
    const restaurantData = fs.readFileSync(filePath, "utf8");
    const restaurants = JSON.parse(restaurantData);

    // Create a prompt for the LLM that includes the user query and restaurant data
    const prompt = `You are a restaurant search assistant. 
Based on the user's query: "${query}", find the most relevant restaurants from this list:
${JSON.stringify(restaurants, null, 2)}

Return ONLY a JSON array of restaurant IDs that match the query, in this format:
{ "matchingRestaurantIds": [1, 2, 3] }
Do not include any other text in your response.`;

    // Call the LLM inference endpoint
    const llmResponse = await axios.post(
      "http://localhost:8080/api/models/inference",
      {
        model: "llama3.2:1b", // Choose an appropriate model
        prompt: prompt,
      }
    );

    // Parse the LLM response to get matching restaurant IDs
    let matchingIds;
    try {
      // The LLM might return some text with the JSON, so we need to extract just the JSON part
      const responseText = llmResponse.data.response;
      // Find JSON content between curly braces
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        matchingIds = JSON.parse(jsonMatch[0]).matchingRestaurantIds || [];
      } else {
        throw new Error("Could not parse LLM response");
      }
    } catch (parseError) {
      console.error("Error parsing LLM response:", parseError);
      return res.status(500).json({
        message: "Failed to process LLM response",
        llmResponse: llmResponse.data.response,
      });
    }

    // Filter restaurants based on the IDs returned by the LLM
    const matchingRestaurants = restaurants.filter((restaurant) =>
      matchingIds.includes(restaurant.id)
    );

    // Return the results along with search metadata
    res.status(200).json({
      query: query,
      results: matchingRestaurants,
      resultsCount: matchingRestaurants.length,
      llmModel: llmResponse.data.model,
    });
  } catch (error) {
    console.error("Error in LLM-based restaurant search:", error);
    res.status(500).json({
      message: "Failed to perform LLM-enhanced search",
      error: error.message,
    });
  }
});

module.exports = router;
