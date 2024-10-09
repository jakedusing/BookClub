const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isUser, validateBook } = require("../middleware");

const Book = require("../models/book");

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
    const book = new Book(req.body.book);
    book.user = req.user_id;
    await book.save();
    req.flash("success", "Successfully added a new book!");
    res.redirect(`/books/${book._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "owner",
        },
      })
      .populate("user");
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
  isUser,
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
  isUser,
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
  isUser,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted book");
    res.redirect("/books");
  })
);

module.exports = router;
