const express = require('express');
const router = express.Router();
const Controllers = require('../controllers');

router.get('/api/books', Controllers.booksController.getAllBooks);
router.get('/api/books/:id', Controllers.booksController.getBookById);
router.get('/api/integrity-check42', (_req, res) => res.sendStatus(204));

module.exports = router;