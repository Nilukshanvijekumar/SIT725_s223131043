const mongoose = require('mongoose');
const Book = require('../models/book');

mongoose.connect('mongodb://127.0.0.1:27017/booksDB');

const sampleData = [
  {
    title: 'The Three-Body Problem',
    author: 'Liu Cixin',
    year: 2008,
    genre: 'Science Fiction',
    summary: 'A science fiction novel about first contact with an alien civilisation.',
    price: '29.99'
  },
  {
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    year: 1847,
    genre: 'Novel',
    summary: 'A coming-of-age story following the emotions and experiences of Jane Eyre.',
    price: '22.00'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: 1813,
    genre: 'Romance',
    summary: 'A classic novel about manners, upbringing, morality and marriage.',
    price: '22.00'
  },
  {
    title: 'The English Patient',
    author: 'Michael Ondaatje',
    year: 1992,
    genre: 'Historical Fiction',
    summary: 'A story of love and loss set during World War II.',
    price: '25.39'
  },
  {
    title: 'The God of Small Things',
    author: 'Arundhati Roy',
    year: 1997,
    genre: 'Fiction',
    summary: 'A novel exploring family, caste and forbidden love in India.',
    price: '31.99'
  }
];

(async () => {
  try {
    await Book.deleteMany({});
    await Book.insertMany(sampleData);
    console.log('Database seeded');
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();