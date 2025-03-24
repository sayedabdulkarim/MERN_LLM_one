const express = require("express");
const router = express.Router();
const { exec } = require("child_process");

// Get all local ollama models
router.get("/ollama", (req, res) => {
  exec("ollama list", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ollama list command: ${error.message}`);
      return res.status(500).json({
        message: "Failed to fetch ollama models",
        error: error.message,
      });
    }

    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
      return res
        .status(500)
        .json({ message: "Error in ollama command", error: stderr });
    }

    try {
      // Parse the command output
      const lines = stdout.trim().split("\n");

      // Skip the header line
      const modelLines = lines.slice(1);

      const models = modelLines
        .map((line) => {
          // Split by multiple spaces and filter out empty elements
          const parts = line.split(/\s+/).filter(Boolean);

          if (parts.length >= 5) {
            return {
              name: parts[0],
              id: parts[1],
              size: `${parts[2]} ${parts[3]}`,
              modified: parts.slice(4).join(" "),
            };
          }
          return null;
        })
        .filter(Boolean);

      res.status(200).json(models);
    } catch (parseError) {
      console.error("Error parsing ollama output:", parseError);
      res.status(500).json({
        message: "Failed to parse ollama models output",
        error: parseError.message,
        rawOutput: stdout,
      });
    }
  });
});

module.exports = router;
