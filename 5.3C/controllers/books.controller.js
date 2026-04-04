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