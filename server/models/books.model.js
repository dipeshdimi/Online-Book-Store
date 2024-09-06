const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  refNumber: String,
  minAge: Number,
  maxAge: Number,
  bookName: String,
  seriesName: String,
  typeOfBook: String,
  genre: String,
  bookNumber: Number,
  authorPrimary: String,
  authorSecondary: String,
  aReviews: Number,
  aRating: Number,
  gRating: Number,
  gReviews: Number,
  pages: Number,
  mainImage: String,
  description: String,
  dateOfPublication: Date,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
