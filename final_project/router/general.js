const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

function getAllBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  getAllBooks().then((books) => {
    return res.status(200).json(books);
  });
});

function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    resolve(books[isbn]);
  });
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  getBookByISBN(req.params.isbn).then((book) => {
    return res.status(200).json(book);
  });
});

function getBookByAuthor(author) {
  return new Promise((resolve, reject) => {
    resolve(Object.values(books).filter((book) => book.author === author));
  });
}

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  getBookByAuthor(req.params.author).then((books) => {
    return res.status(200).json(books);
  });
});

function getBookByTitle(title) {
  return new Promise((resolve, reject) => {
    resolve(Object.values(books).filter((book) => book.title === title));
  });
}

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  getBookByTitle(req.params.title).then((books) => {
    return res.status(200).json(books);
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
