const { bookSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Book = require("./models/book");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in to do this.");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateBook = (req, res, next) => {
  const { error } = bookSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isUser = async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book.user.equals(req.user._id)) {
    req.flash("error", "you do not have permission to do that!");
    return res.redirect(`/books/${id}`);
  }
  next();
};

module.exports.isReviewUser = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.owner.equals(req.user._id)) {
    req.flash("error", "you do not have permission to do that!");
    return res.redirect(`/books/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
