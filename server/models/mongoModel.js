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

async function insertData(collectionName, data) {
    const database = await connectToMongo();
    const collection = database.collection(collectionName);
    return collection.insertMany(data);
  }
  
  async function getBooks(query, sortField, sortOrder, limit = 0) {
    const database = await connectToMongo();
    const collection = database.collection("books");
    let cursor = collection.find(query).sort({ [sortField]: sortOrder });
    if (limit > 0) {
      cursor = cursor.limit(limit);
    }
    return cursor.project({ "mainImage": 1, "aRating": 1, "aReview": 1 }).toArray();
  }



module.exports = { insertData, getBooks };
