const loadBooksBtn = document.getElementById("loadBooksBtn");
const bookList = document.getElementById("book-list");
const bookDetails = document.getElementById("book-details");

function formatPrice(price) {
  if (price && price.$numberDecimal) {
    return Number(price.$numberDecimal).toFixed(2);
  }
  return Number(price).toFixed(2);
}

async function loadBooks() {
  try {
    const response = await fetch("/api/books");
    const books = await response.json();

    bookList.innerHTML = "";
    bookDetails.innerHTML = "<p>Click a book to see details here.</p>";

    if (!books || books.length === 0) {
      bookList.innerHTML = "<li>No books found.</li>";
      return;
    }

    books.forEach((book) => {
      const li = document.createElement("li");
      li.textContent = `${book.title} ${formatPrice(book.price)} AUD`;

      li.addEventListener("click", async () => {
        try {
          const res = await fetch(`/api/books/${book._id}`);
          const selectedBook = await res.json();

          bookDetails.innerHTML = `
            <p><strong>Title:</strong> ${selectedBook.title}</p>
            <p><strong>Author:</strong> ${selectedBook.author}</p>
            <p><strong>Year:</strong> ${selectedBook.year}</p>
            <p><strong>Genre:</strong> ${selectedBook.genre}</p>
            <p><strong>Summary:</strong> ${selectedBook.summary}</p>
            <p><strong>Price (AUD):</strong> ${formatPrice(selectedBook.price)}</p>
          `;
        } catch (error) {
          bookDetails.innerHTML = "<p>Error loading book details.</p>";
        }
      });

      bookList.appendChild(li);
    });
  } catch (error) {
    bookList.innerHTML = "<li>Error fetching books.</li>";
  }
}

loadBooksBtn.addEventListener("click", loadBooks);