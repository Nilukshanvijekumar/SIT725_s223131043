const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/booksDB');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const booksRoute = require('./routes/books.routes');
app.use('/', booksRoute);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    statusCode: 500,
    data: null,
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});