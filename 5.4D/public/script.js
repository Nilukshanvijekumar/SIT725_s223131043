const booksListEl = document.getElementById('books-list');
const bookDetailsEl = document.getElementById('book-details');
const loadBooksBtn = document.getElementById('load-books-btn');

async function getAllBooks() {
  try {
    const response = await fetch('/api/books');
    const result = await response.json();

    if (response.ok && result.data) {
      renderBooks(result.data);
    } else {
      booksListEl.innerHTML = '<p>Failed to load books.</p>';
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    booksListEl.innerHTML = '<p>Error loading books.</p>';
  }
}

function renderBooks(books) {
  booksListEl.innerHTML = '';

  books.forEach((book) => {
    const item = document.createElement('div');
    item.className = 'book-item';
    item.textContent = `${book.title} ${book.price} AUD`;
    item.style.cursor = 'pointer';

    item.addEventListener('click', () => {
      getBookDetails(book.id);
    });

    booksListEl.appendChild(item);
  });
}

async function getBookDetails(id) {
  try {
    const response = await fetch(`/api/books/${id}`);
    const result = await response.json();

    if (response.ok && result.data) {
      renderBookDetails(result.data);
    } else {
      bookDetailsEl.innerHTML = '<p>Book details not found.</p>';
    }
  } catch (error) {
    console.error('Error fetching book details:', error);
    bookDetailsEl.innerHTML = '<p>Error loading book details.</p>';
  }
}

function renderBookDetails(book) {
  bookDetailsEl.innerHTML = `
    <h3>${book.title}</h3>
    <p><strong>ID:</strong> ${book.id}</p>
    <p><strong>Author:</strong> ${book.author}</p>
    <p><strong>Year:</strong> ${book.year}</p>
    <p><strong>Genre:</strong> ${book.genre}</p>
    <p><strong>Summary:</strong> ${book.summary}</p>
    <p><strong>Price:</strong> ${book.price} AUD</p>
  `;
}

if (loadBooksBtn) {
  loadBooksBtn.addEventListener('click', getAllBooks);
}