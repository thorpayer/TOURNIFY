const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const authController = require("../controllers/authController");

// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", isLoggedOut, authController.signup);

// GET /auth/login
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, authController.login);

// GET Profile
router.get("/profile", isLoggedIn, authController.getProfile);
router.post(
  "/profile",
  isLoggedIn,
  fileUploader.single("profilePicture"),
  authController.updateProfile
);

// GET /auth/logout
router.get("/logout", isLoggedIn, authController.logout);

module.exports = router;
