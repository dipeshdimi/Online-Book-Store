const express = require("express");
const router = express.Router();
const { fetchAndStoreData, getTopBooks, getBestSellers, getNewArrivals, getBooksBySeries, getDistinctSeriesByPopularity } = require("../controllers/books.controller");

router.get("/fetch", fetchAndStoreData);
router.get("/top-books", getTopBooks);
router.get("/best-sellers", getBestSellers);
router.get("/new-arrivals", getNewArrivals);
router.get("/series-books", getBooksBySeries);
router.get('/popular-series', getDistinctSeriesByPopularity);

module.exports = router;
