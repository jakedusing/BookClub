const express = require("express");
const router = express.Router();
const books = require("../controllers/books");
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  isUser,
  validateBook,
  isValidObjectId,
} = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Book = require("../models/book");

router
  .route("/")
  .get(catchAsync(books.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateBook,
    catchAsync(books.createBook)
  );

router.get("/new", isLoggedIn, books.renderNewForm);

router.get(
  "/search",
  catchAsync(async (req, res) => {
    const query = req.query.q; // Get the search query from the URL
    let results = [];

    // console.log("search query receieved:", query);

    if (query) {
      // use a case-insensitive regex search on the title
      results = await Book.find({ title: new RegExp(query, "i") }); // search the book collection, the "i" is for case-insensitive
      // console.log("Search results found:", results);
    }

    res.render("books/searchResults", { results, query }); // Render results in a new view
  })
);

router
  .route("/:id")
  .get(catchAsync(books.showBook))
  .put(
    isLoggedIn,
    isUser,
    upload.array("image"),
    validateBook,
    catchAsync(books.updateBook)
  )
  .delete(isLoggedIn, isUser, catchAsync(books.deleteBook));

router.get(
  "/:id/edit",
  isValidObjectId,
  isLoggedIn,
  isUser,
  catchAsync(books.renderEditForm)
);

module.exports = router;
