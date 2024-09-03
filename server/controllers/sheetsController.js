const { google } = require("googleapis");
const { insertData, getBooks, clearCollection } = require("../models/mongoModel");

// Function to parse date strings in the format "21 January 2008"
function parseDate(dateString) {
  // The date format is assumed to be "21 January 2008"
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
    const books = await getBooks({aReviews: { $gte: 1000 }}, "aRating", -1, limit);
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

    const books = await getBooks({}, "aReviews", -1, limit, skip); // Sort by aReviews descending
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

    const books = await getBooks({}, "dateOfPublication", -1, limit, skip);
    res.json(books);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error fetching new arrivals");
  }
}

module.exports = {
  fetchAndStoreData,
  getTopBooks,
  getBestSellers,
  getNewArrivals,
};
