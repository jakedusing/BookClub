const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");
const { storeReturnTo, isLoggedIn } = require("../middleware");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });

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

// Profile Picture upload Route
router.post(
  "/upload-profile-picture",
  isLoggedIn,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      // if the user already has a profile image, delete it from cloudinary
      if (user.profileImage && user.profileImage.filename) {
        await cloudinary.uploader.destroy(user.profileImage.filename); // Delete the old profile image
      }

      // upload the new image to CLoudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // upload the user's profile picture
      user.profileImage = {
        url: result.secure_url,
        filename: result.public_id,
      };

      await user.save();
      req.flash("success", "Profile picture updated successfully!");
      res.redirect(`/users/${req.user._id}`);
    } catch (error) {
      console.log(error);
      req.flash("error", "Failed to upload profile picture.");
      res.redirect(`/users/${req.user._id}`);
    }
  }
);

// Show user profile route
router.get("/users/:id", isLoggedIn, catchAsync(users.showProfile));

module.exports = router;
