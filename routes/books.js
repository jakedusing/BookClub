const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { bookSchema } = require("../schemas");
const { isLoggedIn } = require("../middleware");

const ExpressError = require("../utils/ExpressError");
const Book = require("../models/book");

const validateBook = (req, res, next) => {
  const { error } = bookSchema.validate(req.body);
  if (error) {
    // details is an array, need to grab each individual one
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const books = await Book.find({});
    res.render("books/index", { books });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("books/new");
});

router.post(
  "/",
  isLoggedIn,
  validateBook,
  catchAsync(async (req, res, next) => {
    // if (!req.body.book) throw new ExpressError("Invalid Book Data", 400);
    const book = new Book(req.body.book);
    await book.save();
    req.flash("success", "Successfully added a new book!");
    res.redirect(`/books/${book._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("reviews");
    if (!book) {
      req.flash("error", "Cannot find that book!");
      return res.redirect("/books");
    }
    res.render("books/show", { book });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
      req.flash("error", "Cannot find that book!");
      return res.redirect("/books");
    }
    res.render("books/edit", { book });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateBook,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { ...req.body.book });
    req.flash("success", "Successfully updated book");
    res.redirect(`/books/${book._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted book");
    res.redirect("/books");
  })
);

module.exports = router;
