const { parseDate } = require("../utils/dateUtils");
const { Book } = require("../models");
const { google } = require("googleapis");

async function fetchAndStoreData(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = process.env.SPREADSHEET_ID;

    const getRows = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range: "online-book-store!A:R",
    });

    const rows = getRows.data.values;

    if (!rows || rows.length === 0) {
      res.status(404).send("No data found in Google Sheets.");
      return;
    }

    const headers = rows[0];
    const numericColumns = [1, 2, 7, 10, 11, 12, 13, 14];
    const dateColumnIndex = headers.indexOf('dateOfPublication');

    const data = rows.slice(1).map((row) => {
      let obj = {};
      headers.forEach((header, index) => {
        let value = row[index] || "";

        if (numericColumns.includes(index)) {
          value = Number(value);
          if (isNaN(value)) value = null;
        }

        if (index === dateColumnIndex) {
          value = parseDate(value);
        }

        obj[header] = value;
      });
      return obj;
    }).filter(item => item.dateOfPublication !== null);

    console.log("Data to be inserted:", data);

    await Book.deleteMany({});
    
    try {
      const result = await Book.insertMany(data);
      console.log("Insert result:", result);
    } catch (err) {
      console.error("Error inserting data:", err);
    }

    res.json({
      message: "Data successfully inserted into MongoDB",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error processing data");
  }
}

async function getTopBooks(req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;

    const query = { aReviews: { $gte: 1000 } };

    const books = await Book.find(query).sort({ aRating: -1 }).limit(limit);
    res.json(books);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error fetching top books");
  }
}

async function getBestSellers(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const minAge = parseInt(req.query.minAge, 10) || 0;
    const maxAge = parseInt(req.query.maxAge, 10) || 100;

    const query = {minAge: { $gte: minAge }, maxAge: { $lte: maxAge }};

    const books = await Book.find(query).sort({ aReviews: -1 }).skip(skip).limit(limit);
    res.json(books);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error fetching best sellers");
  }
}

async function getNewArrivals(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;
    const minAge = parseInt(req.query.minAge, 10) || 0;
    const maxAge = parseInt(req.query.maxAge, 10) || 100;

    const query = {minAge: { $gte: minAge }, maxAge: { $lte: maxAge }};

    const books = await Book.find(query).sort({ dateOfPublication: -1 }).skip(skip).limit(limit);
    res.json(books);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error fetching new arrivals");
  }
}

async function getBooksBySeries(req, res) {
  try {
    const seriesName = req.query.seriesName;
    
    if (!seriesName) {
      res.status(400).send("Series name is required.");
      return;
    }

    const books = await Book.find({ seriesName });
    res.json(books);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error fetching books by series");
  }
}

async function getDistinctSeriesByPopularity(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const series = await Book.aggregate([
      { $match: { seriesName: { $ne: "" } } },
      { $group: { _id: "$seriesName", numberOfBooks: { $sum: 1 }, mainImage: { $first: "$mainImage" } } },
      { $sort: { numberOfBooks: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: { _id: 0, seriesName: "$_id", numberOfBooks: 1, mainImage: 1 } }
    ]);

    res.json(series);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error fetching distinct series by popularity");
  }
}

module.exports = {
  fetchAndStoreData,
  getTopBooks,
  getBestSellers,
  getNewArrivals,
  getBooksBySeries,
  getDistinctSeriesByPopularity
};
