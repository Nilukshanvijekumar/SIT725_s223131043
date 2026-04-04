const Book = require('../models/book');

async function getAllBooks() {
  const books = await Book.find({});
  return books.map(book => book.toJSON());
}

async function getBookById(id) {
  const book = await Book.findById(id);
  return book ? book.toJSON() : null;
}

module.exports = {
  getAllBooks,
  getBookById
};