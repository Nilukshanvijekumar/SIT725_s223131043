const Book = require('../models/book');

const CREATE_ALLOWED_FIELDS = ['id', 'title', 'author', 'year', 'genre', 'summary', 'price'];
const UPDATE_ALLOWED_FIELDS = ['title', 'author', 'year', 'genre', 'summary', 'price'];

function getUnknownFields(payload, allowedFields) {
  return Object.keys(payload || {}).filter((key) => !allowedFields.includes(key));
}

function formatValidationError(err) {
  if (err?.name === 'ValidationError') {
    return Object.values(err.errors).map((e) => e.message).join('; ');
  }
  return err?.message || 'Validation failed';
}

async function getAllBooks() {
  const books = await Book.find({}).sort({ id: 1 });
  return books.map((book) => book.toJSON());
}

async function getBookById(id) {
  const book = await Book.findOne({ id });
  return book ? book.toJSON() : null;
}

async function createBook(payload) {
  const unknownFields = getUnknownFields(payload, CREATE_ALLOWED_FIELDS);
  if (unknownFields.length > 0) {
    return {
      ok: false,
      status: 400,
      message: `Unexpected field(s): ${unknownFields.join(', ')}`
    };
  }

  try {
    const book = new Book({
      id: payload.id,
      title: payload.title,
      author: payload.author,
      year: payload.year,
      genre: payload.genre,
      summary: payload.summary,
      price: payload.price
    });

    await book.save();

    return {
      ok: true,
      status: 201,
      data: book.toJSON(),
      message: 'Book created successfully'
    };
  } catch (err) {
    if (err?.code === 11000) {
      return {
        ok: false,
        status: 409,
        message: 'A book with this id already exists'
      };
    }

    return {
      ok: false,
      status: 400,
      message: formatValidationError(err)
    };
  }
}

async function updateBook(id, payload) {
  if (Object.prototype.hasOwnProperty.call(payload || {}, 'id')) {
    return {
      ok: false,
      status: 400,
      message: 'id is immutable and cannot be changed'
    };
  }

  const unknownFields = getUnknownFields(payload, UPDATE_ALLOWED_FIELDS);
  if (unknownFields.length > 0) {
    return {
      ok: false,
      status: 400,
      message: `Unexpected field(s): ${unknownFields.join(', ')}`
    };
  }

  const missingFields = UPDATE_ALLOWED_FIELDS.filter(
    (field) => !Object.prototype.hasOwnProperty.call(payload || {}, field)
  );

  if (missingFields.length > 0) {
    return {
      ok: false,
      status: 400,
      message: `Missing required field(s): ${missingFields.join(', ')}`
    };
  }

  try {
    const updatedBook = await Book.findOneAndUpdate(
      { id },
      { $set: payload },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedBook) {
      return {
        ok: false,
        status: 404,
        message: 'Book not found'
      };
    }

    return {
      ok: true,
      status: 200,
      data: updatedBook.toJSON(),
      message: 'Book updated successfully'
    };
  } catch (err) {
    return {
      ok: false,
      status: 400,
      message: formatValidationError(err)
    };
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook
};