const request = require('supertest');
const { expect } = require('chai');
const app = require('../server');

describe('Books API endpoints', function () {
  it('should return all books with status 200', async function () {
    const response = await request(app).get('/api/books');

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Books catalog retrieved using service');
    expect(response.body.data).to.be.an('array').with.length.greaterThan(0);
  });

  it('should return one book when a valid id is provided', async function () {
    const response = await request(app).get('/api/books/b1');

    expect(response.status).to.equal(200);
    expect(response.body.data).to.be.an('object');
    expect(response.body.data.id).to.equal('b1');
    expect(response.body.data.title).to.equal('The Three-Body Problem');
  });

  it('should return 404 when the book id does not exist', async function () {
    const response = await request(app).get('/api/books/unknown-book');

    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal('Book not found');
    expect(response.body.data).to.equal(null);
  });
});
