const booksService = require('../services/books.service');

exports.getAllBooks = (req, res) => {
  const items = booksService.getAllBooks();

  res.json({
    status: 200,
    data: items,
    message: 'Books catalog retrieved using service'
  });
};

exports.getBookById = (req, res) => {
  const item = booksService.getBookById(req.params.id);

  if (!item) {
    return res.status(404).json({
      status: 404,
      data: null,
      message: 'Book not found'
    });
  }

  res.json({
    status: 200,
    data: item,
    message: 'Book retrieved using service'
  });
};