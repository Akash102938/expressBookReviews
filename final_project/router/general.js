const axios = require('axios');

// Get the book list available in the shop using Async/Await / Promises
public_users.get('/', async function (req, res) {
  try {
    // Simulated async fetch or internal reference mapped via promises
    const getBooks = () => Promise.resolve(books);
    const bookList = await getBooks();
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const findBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  findBook
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});
  
// Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const findByAuthor = new Promise((resolve) => {
    let results = [];
    Object.keys(books).forEach((key) => {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        results.push({ isbn: key, ...books[key] });
      }
    });
    resolve(results);
  });

  findByAuthor.then((filteredBooks) => res.status(200).json(filteredBooks));
});

// Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const findByTitle = new Promise((resolve) => {
    let results = [];
    Object.keys(books).forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        results.push({ isbn: key, ...books[key] });
      }
    });
    resolve(results);
  });

  findByTitle.then((filteredBooks) => res.status(200).json(filteredBooks));
});