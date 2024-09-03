const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoUrl = process.env.MONGODB_URI;
let db;

async function connectToMongo() {
  if (db) return db;
  try {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    db = client.db();
    console.log("Connected to MongoDB");
    return db;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

// Function to clear the collection
async function clearCollection(collectionName) {
  const database = await connectToMongo();
  const collection = database.collection(collectionName);
  return collection.deleteMany({});
}

// Insert data into MongoDB
async function insertData(collectionName, data) {
  const database = await connectToMongo();
  const collection = database.collection(collectionName);
  return collection.insertMany(data);
}

// Fetch books with optional pagination and sorting
async function getBooks(query, sortField, sortOrder, limit = 0, skip = 0) {
  const database = await connectToMongo();
  const collection = database.collection("books");

  // Start with the query and sort the results
  let cursor = collection.find(query).sort({ [sortField]: sortOrder });

  // Apply limit and skip if provided
  if (limit > 0) {
    cursor = cursor.limit(limit);
  }
  if (skip > 0) {
    cursor = cursor.skip(skip);
  }

  // Project specific fields and convert to array
  return cursor
    .project({ bookName: 1, mainImage: 1, aRating: 1, aReviews: 1 })
    .toArray();
}

module.exports = { insertData, getBooks, clearCollection };
