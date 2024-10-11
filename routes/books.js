const express = require("express");
const router = express.Router();
const books = require("../controllers/books");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isUser, validateBook } = require("../middleware");

const Book = require("../models/book");

router.get("/", catchAsync(books.index));

router.get("/new", isLoggedIn, books.renderNewForm);

router.post("/", isLoggedIn, validateBook, catchAsync(books.createBook));

router.get("/:id", catchAsync(books.showBook));

router.get("/:id/edit", isLoggedIn, isUser, catchAsync(books.renderEditForm));

router.put(
  "/:id",
  isLoggedIn,
  isUser,
  validateBook,
  catchAsync(books.updateBook)
);

router.delete("/:id", isLoggedIn, isUser, catchAsync(books.deleteBook));

module.exports = router;
