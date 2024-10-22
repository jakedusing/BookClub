const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");
const { storeReturnTo, isLoggedIn } = require("../middleware");

// Register routes
router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

// Login routes
router
  .route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

// Logout route
router.get("/logout", users.logout);

//User Profile route (GET request, only accessible if Logged in)
router.get("/profile", isLoggedIn, catchAsync(users.showProfile));

module.exports = router;
