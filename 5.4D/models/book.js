const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const bookSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'id is required'],
      unique: true,
      immutable: true,
      trim: true,
      minlength: [2, 'id must be at least 2 characters'],
      maxlength: [20, 'id must be at most 20 characters']
    },
    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true,
      minlength: [2, 'title must be at least 2 characters'],
      maxlength: [100, 'title must be at most 100 characters']
    },
    author: {
      type: String,
      required: [true, 'author is required'],
      trim: true,
      minlength: [2, 'author must be at least 2 characters'],
      maxlength: [60, 'author must be at most 60 characters']
    },
    year: {
      type: Number,
      required: [true, 'year is required'],
      min: [1000, 'year must be at least 1000'],
      max: [currentYear, `year must not be greater than ${currentYear}`],
      validate: {
        validator: Number.isInteger,
        message: 'year must be an integer'
      }
    },
    genre: {
      type: String,
      required: [true, 'genre is required'],
      trim: true,
      minlength: [3, 'genre must be at least 3 characters'],
      maxlength: [30, 'genre must be at most 30 characters']
    },
    summary: {
      type: String,
      required: [true, 'summary is required'],
      trim: true,
      minlength: [10, 'summary must be at least 10 characters'],
      maxlength: [500, 'summary must be at most 500 characters']
    },
    price: {
      type: mongoose.Decimal128,
      required: [true, 'price is required'],
      get: v => (v ? v.toString() : null),
      validate: {
        validator: function (value) {
          const num = parseFloat(value?.toString?.() ?? value);
          return Number.isFinite(num) && num > 0 && num <= 9999.99;
        },
        message: 'price must be a number greater than 0 and at most 9999.99'
      }
    }
  },
  {
    toJSON: {
      getters: true,
      virtuals: false,
      transform: (_doc, ret) => {
        delete ret.__v;
        delete ret._id;
        return ret;
      }
    },
    toObject: {
      getters: true,
      virtuals: false
    }
  }
);

module.exports = mongoose.model('Book', bookSchema);