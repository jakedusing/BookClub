const express = require("express");
const router = express.Router();
const books = require("../controllers/books");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isUser, validateBook } = require("../middleware");

const Book = require("../models/book");

router
  .route("/")
  .get(catchAsync(books.index))
  .post(isLoggedIn, validateBook, catchAsync(books.createBook));

router.get("/new", isLoggedIn, books.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(books.showBook))
  .put(isLoggedIn, isUser, validateBook, catchAsync(books.updateBook))
  .delete(isLoggedIn, isUser, catchAsync(books.deleteBook));

router.get("/:id/edit", isLoggedIn, isUser, catchAsync(books.renderEditForm));

module.exports = router;
