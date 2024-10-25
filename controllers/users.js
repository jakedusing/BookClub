const Book = require("../models/book");
const User = require("../models/user");
const getRandomGreeting = require("../utils/greetings.js");
const getRandomImage = require("../utils/randomImage.js");

module.exports.renderRegister = (req, res) => {
  res.render("users/register", { getRandomImage });
};

module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Book Club");
      res.redirect("/books");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login", { getRandomImage });
};

module.exports.login = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = res.locals.returnTo || "/books";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/books");
  });
};

// Show a user's profile by their ID
module.exports.showProfile = async (req, res) => {
  try {
    // Get the user ID from the route parameters
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user is not found, send a 404 response
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Find books that belong to this user
    const books = await Book.find({ user: user._id });

    // Render the profile view, passing the user and their books
    res.render("users/profile", { user, books, getRandomGreeting });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).send("Server error.");
  }
};
