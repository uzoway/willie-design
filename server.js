const express = require("express");
const path = require("path");
const app = express();

// Set the static files location
app.use(express.static(path.join(__dirname, "public")));

// Middleware to handle URLs without .html extension
app.use((req, res, next) => {
  // Check if the request URL doesn't have a file extension
  if (!path.extname(req.path)) {
    // Try to serve the .html file
    const potentialHtmlPath = path.join(
      __dirname,
      "public",
      req.path + ".html"
    );
    res.sendFile(potentialHtmlPath, (err) => {
      if (err) {
        // If the file doesn't exist, move to the next middleware
        next();
      }
    });
  } else {
    // If the URL has an extension, just proceed to the next middleware
    next();
  }
});

// Catch all route to handle 404
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
