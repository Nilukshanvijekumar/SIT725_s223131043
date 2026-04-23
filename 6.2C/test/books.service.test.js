const { expect } = require('chai');
const booksService = require('../services/books.service');

describe('Book calculation function', function () {
  it('should calculate the average publication year for the default book list', function () {
    const result = booksService.calculateAveragePublicationYear();

    expect(result).to.equal(1930.4);
  });

  it('should return 0 for an empty book list edge case', function () {
    const result = booksService.calculateAveragePublicationYear([]);

    expect(result).to.equal(0);
  });

  it('should throw an error for invalid input that is not an array', function () {
    expect(() => booksService.calculateAveragePublicationYear('not-an-array')).to.throw(
      'Input must be an array of books'
    );
  });

  it('should throw an error when a book has an invalid year value', function () {
    const invalidBooks = [{ id: 'x1', year: '2020' }];

    expect(() => booksService.calculateAveragePublicationYear(invalidBooks)).to.throw(
      'Each book must contain a valid numeric year'
    );
  });
});
