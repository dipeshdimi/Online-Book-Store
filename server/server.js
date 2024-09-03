const express = require("express");
require("dotenv").config();
const sheetsRoutes = require("./routes/sheetsRoutes");
const cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use("/api/sheets", sheetsRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
