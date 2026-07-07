const express = require("express");
const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");

const public_users = express.Router();

/* ============================
   Register a New User
============================ */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  // Check if username already exists
  const userExists = users.some(
    (user) => user.username === username
  );

  if (userExists) {
    return res.status(409).json({
      message: "Username already exists",
    });
  }

  // Register new user
  users.push({ username, password });

  return res.status(201).json({
    message: "User successfully registered. Now you can login.",
  });
});

/* ============================
   Get All Books
============================ */
public_users.get("/", (req, res) => {
  if (!books) {
    return res.status(500).json({
      message: "Books data not found",
    });
  }

  return res.status(200).json(books);
});

/* ============================
   Get Book by ISBN
============================ */
public_users.get("/isbn/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book with this ISBN not found",
    });
  }

  return res.status(200).json(book);
});

/* ============================
   Get Books by Author
============================ */
public_users.get("/author/:author", (req, res) => {
  const targetAuthor = req.params.author.toLowerCase();

  const matchingBooks = Object.keys(books)
    .filter(
      (isbn) =>
        books[isbn].author &&
        books[isbn].author.toLowerCase() === targetAuthor
    )
    .map((isbn) => ({
      isbn,
      title: books[isbn].title,
      author: books[isbn].author,
      reviews: books[isbn].reviews,
    }));

  if (matchingBooks.length === 0) {
    return res.status(404).json({
      message: "No books found for this author",
    });
  }

  return res.status(200).json(matchingBooks);
});

/* ============================
   Get Books by Title
============================ */
public_users.get("/title/:title", (req, res) => {
  const targetTitle = req.params.title.toLowerCase();

  const matchingBooks = Object.keys(books)
    .filter(
      (isbn) =>
        books[isbn].title &&
        books[isbn].title.toLowerCase() === targetTitle
    )
    .map((isbn) => ({
      isbn,
      title: books[isbn].title,
      author: books[isbn].author,
      reviews: books[isbn].reviews,
    }));

  if (matchingBooks.length === 0) {
    return res.status(404).json({
      message: "No books found with this title",
    });
  }

  return res.status(200).json(matchingBooks);
});

/* ============================
   Get Reviews by ISBN
============================ */
public_users.get("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({
      message: "Book with this ISBN not found",
    });
  }

  return res.status(200).json(book.reviews || {});
});

module.exports.general = public_users;