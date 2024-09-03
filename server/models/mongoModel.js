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

  let cursor;

  // Handle the distinct series aggregation
  if (sortField === "seriesName") {
    cursor = collection.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: "$seriesName",
          numberOfBooks: { $sum: 1 },
          bookImage: {
            $first: {
              $cond: [
                { $eq: ["$bookNumber", 1] },
                "$mainImage",
                "$$REMOVE"
              ]
            }
          }
        }
      },
      {
        $sort: { _id: sortOrder } // Sort by seriesName if specified
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 0,
          seriesName: "$_id",
          numberOfBooks: 1,
          bookImage: { $ifNull: ["$bookImage", null] } // Ensure bookImage is null if no bookNumber=1
        }
      }
    ]);
  } else {
    cursor = collection.find(query).sort({ [sortField]: sortOrder });

    if (limit > 0) cursor = cursor.limit(limit);
    if (skip > 0) cursor = cursor.skip(skip);

    cursor = cursor.project({ minAge: 1, maxAge: 1, bookName: 1,seriesName: 1, mainImage: 1, aRating: 1, aReviews: 1 });
  }

  return cursor.toArray();
}

module.exports = { insertData, getBooks, clearCollection };
