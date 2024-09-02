const express = require("express");
const router = express.Router();
const { fetchAndStoreData, getTopBooks, getBestSellers, getNewArrivals } = require("../controllers/sheetsController");

// Route to fetch and store data from Google Sheets
router.get("/fetch", fetchAndStoreData);

// Route to get top books by A.Rating
router.get("/top-books", getTopBooks);

// Route to get best sellers by A.Reviews
router.get("/best-sellers", getBestSellers);

// Route to get new arrivals by DOP
router.get("/new-arrivals", getNewArrivals);

module.exports = router;
