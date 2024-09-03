const { google } = require("googleapis");
const { insertData, getBooks, clearCollection } = require("../models/mongoModel");

// Function to parse date strings in the format "21 January 2008"
function parseDate(dateString) {
  const [day, monthName, year] = dateString.split(' ');
  const month = new Date(Date.parse(monthName + " 1, 2021")).getMonth(); // Get month index
  return new Date(year, month, day);
}

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

    if (!rows.length) {
      res.status(404).send("No data found in Google Sheets.");
      return;
    }

    const headers = rows[0];
    const numericColumns = [1, 2, 7, 10, 11, 12, 13, 14]; // Specify column indices that should be numeric
    const dateColumnIndex = headers.indexOf('dateOfPublication'); // Find the index of the date column

    const data = rows.slice(1).map((row) => {
      let obj = {};
      headers.forEach((header, index) => {
        let value = row[index] || "";

        // Convert to number if column index is in numericColumns
        if (numericColumns.includes(index)) {
          value = Number(value); // Convert to number
        }

        // Parse date if column is dateOfPublication
        if (index === dateColumnIndex) {
          value = parseDate(value); // Convert to Date object
        }

        obj[header] = value;
      });
      return obj;
    });

    // Clear the existing data in the collection before inserting new data
    await clearCollection("books");

    // Insert all row data into the collection
    await insertData("books", data);

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
    const minAge = parseInt(req.query.minAge, 10) || null;
    const maxAge = parseInt(req.query.maxAge, 10) || null;

    // Build the query
    const query = { aReviews: { $gte: 1000 } };
    if (minAge !== null) query.minAge = { $gte: minAge };
    if (maxAge !== null) query.maxAge = { $lte: maxAge };

    const books = await getBooks(query, "aRating", -1, limit);
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
    const minAge = parseInt(req.query.minAge, 10) || null;
    const maxAge = parseInt(req.query.maxAge, 10) || null;

    // Build the query
    const query = {};
    if (minAge !== null) query.minAge = { $gte: minAge };
    if (maxAge !== null) query.maxAge = { $lte: maxAge };

    const books = await getBooks(query, "aReviews", -1, limit, skip);
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
    const minAge = parseInt(req.query.minAge, 10) || null;
    const maxAge = parseInt(req.query.maxAge, 10) || null;

    // Build the query
    const query = {};
    if (minAge !== null) query.minAge = { $gte: minAge };
    if (maxAge !== null) query.maxAge = { $lte: maxAge };

    const books = await getBooks(query, "dateOfPublication", -1, limit, skip);
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

    const books = await getBooks({ seriesName }); // Fetch books by series
    res.json(books);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error fetching books by series");
  }
}

// Fetch distinct series by popularity
async function getDistinctSeriesByPopularity(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Aggregate distinct series and sort by popularity
    const series = await getBooks({}, "popularityScore", -1, limit, skip);

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
