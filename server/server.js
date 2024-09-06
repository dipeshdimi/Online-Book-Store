const express = require("express");
const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");
const sheetsRoutes = require("./routes/books.route");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use("/api/sheets", sheetsRoutes);

const port = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});