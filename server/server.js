const express = require("express");
require("dotenv").config();
const sheetsRoutes = require("./routes/sheetsRoutes");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To handle JSON bodies

// Use routes
app.use("/api/sheets", sheetsRoutes); // Define API route prefix

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
