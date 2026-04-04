const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const booksRoute = require('./routes/books.routes');
app.use('/api/books', booksRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});