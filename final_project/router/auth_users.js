const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// Helper function to check if username and password match
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 1. Error Check: Verify both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // 2. Authentication Check: Verify credentials match a registered user
  if (authenticatedUser(username, password)) {
    // 3. Generate JWT access token (valid for 1 hour)
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // 4. Save the token and username into the session
    req.session.authorization = {
      accessToken, username
    };

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review; // Retrieve review text from query parameters
  const username = req.session.authorization?.username; // Retrieve username from session

  // 1. Error Check: Ensure the user is authenticated via session
  if (!username) {
    return res.status(401).json({ message: "User not logged in or session expired" });
  }

  // 2. Error Check: Check if the review parameter was passed
  if (!review) {
    return res.status(400).json({ message: "Review text is required as a query parameter (?review=...)" });
  }

  // 3. Error Check: Check if the book exists in the database
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book with this ISBN not found" });
  }

  // 4. Update or Add the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({ 
    message: `Review for ISBN ${isbn} successfully added/updated by user '${username}'` 
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username; // Retrieve username from session

  // 1. Error Check: Ensure the user is authenticated via session
  if (!username) {
    return res.status(401).json({ message: "User not logged in or session expired" });
  }

  // 2. Error Check: Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book with this ISBN not found" });
  }

  // 3. Check if this specific user has a review for this book
  if (books[isbn].reviews && books[isbn].reviews[username]) {
    // Delete only this user's review key from the reviews object
    delete books[isbn].reviews[username];
    
    return res.status(200).json({ 
      message: `Review for ISBN ${isbn} successfully deleted for user '${username}'` 
    });
  } else {
    return res.status(404).json({ message: "No review found for this user on this book" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
