const fs = require("fs");
const path = require("path");

// Read the JSON file directly
const jsonFilePath = path.join(__dirname, "../dummyData/allRestaurnt.json");
const restaurantData = fs.readFileSync(jsonFilePath, "utf8");

// Parse the JSON data
const restaurantsArray = JSON.parse(restaurantData);

// Convert the JavaScript array to a JSON string with proper formatting
const jsonData = JSON.stringify(restaurantsArray, null, 2);

// Write the JSON data to a file
fs.writeFileSync(
  path.join(__dirname, "../dummyData/restaurants.json"),
  jsonData
);

console.log("Successfully converted restaurant data to JSON format");
