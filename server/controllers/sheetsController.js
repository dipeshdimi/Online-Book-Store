const { google } = require("googleapis");
const { insertData, getBooks } = require("../models/mongoModel");

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
      const data = rows.slice(1).map(row => {
        let obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || ""; // Handle missing cells
        });
        return obj;
      });
  
      // Insert all row data into a single collection
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
    const books = await getBooks({}, "aRating", -1, 10); // Sort by aRating in descending order and limit to 10
    res.json(books);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error fetching top books");
  }
}

async function getBestSellers(req, res) {
  try {
    const books = await getBooks({}, "aReviews", -1); // Sort by aReviews in descending order
    res.json(books);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error fetching best sellers");
  }
}

async function getNewArrivals(req, res) {
  try {
    const books = await getBooks({}, "dateOfPublication", -1); // Sort by dateOfPublication in descending order
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
