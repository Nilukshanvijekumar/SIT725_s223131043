const booksService = require('../services/books.service');

exports.getAllBooks = async (_req, res, next) => {
  try {
    const items = await booksService.getAllBooks();
    res.status(200).json({
      statusCode: 200,
      data: items,
      message: 'Books retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const item = await booksService.getBookById(req.params.id);

    if (!item) {
      return res.status(404).json({
        statusCode: 404,
        data: null,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: item,
      message: 'Book retrieved successfully'
    });
  } catch (err) {
    next(err);
  }
};

exports.createBook = async (req, res, next) => {
  try {
    const result = await booksService.createBook(req.body);

    if (!result.ok) {
      return res.status(result.status).json({
        statusCode: result.status,
        data: null,
        message: result.message
      });
    }

    res.status(result.status).json({
      statusCode: result.status,
      data: result.data,
      message: result.message
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const result = await booksService.updateBook(req.params.id, req.body);

    if (!result.ok) {
      return res.status(result.status).json({
        statusCode: result.status,
        data: null,
        message: result.message
      });
    }

    res.status(result.status).json({
      statusCode: result.status,
      data: result.data,
      message: result.message
    });
  } catch (err) {
    next(err);
  }
};