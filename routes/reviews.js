const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewUser } = require("../middleware");
const Book = require("../models/book");
const Review = require("../models/review");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const book = await Book.findById(req.params.id);
    const review = new Review(req.body.review);
    review.owner = req.user._id;
    book.reviews.push(review);
    await review.save();
    await book.save();
    req.flash("success", "Created new review!");
    res.redirect(`/books/${book._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewUser,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Book.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/books/${id}`);
  })
);

module.exports = router;
