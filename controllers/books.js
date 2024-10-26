const mongoose = require("mongoose");
const Book = require("../models/book");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const books = await Book.find({}).populate("user");
  res.render("books/index", { books });
};

module.exports.renderNewForm = (req, res) => {
  res.render("books/new");
};

module.exports.createBook = async (req, res, next) => {
  const book = new Book(req.body.book);
  book.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  book.user = req.user._id;
  //console.log(req.user._id);
  await book.save();
  req.flash("success", "Successfully added a new book!");
  res.redirect(`/books/${book._id}`);
};

module.exports.showBook = async (req, res) => {
  const { id } = req.params;

  //check if the ID is a valid ObjectID
  if (!mongoose.isValidObjectId(id)) {
    req.flash("error", "Invalid book ID!");
    return res.redirect("/books");
  }
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
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;

  // Check if the ID is a valid ObjectId (24 characters and hex)
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid book ID!");
    return res.redirect("/books");
  }

  try {
    const book = await Book.findById(id);
    if (!book) {
      req.flash("error", "Cannot find that book!");
      return res.redirect("/books");
    }
    res.render("books/edit", { book });
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while retrieving the book.");
    res.redirect("/books");
  }
};

module.exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findByIdAndUpdate(id, { ...req.body.book });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  book.images.push(...imgs);
  await book.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await book.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    //  console.log(book);
  }
  req.flash("success", "Successfully updated book");
  res.redirect(`/books/${book._id}`);
};

module.exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  await Book.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted book");
  res.redirect("/books");
};
