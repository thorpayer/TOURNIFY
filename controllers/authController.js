const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");
const saltRounds = 10;

// Function to handle user signup
const signup = (req, res) => {
  const { username, fullname, email, password, confirmPassword } = req.body;

  // Check that username, email, and password are provided
  if (
    username === "" ||
    password === "" ||
    confirmPassword === "" ||
    fullname == ""
  ) {
    res.status(400).render("auth/signup", {
      errorMessage: " Please provide your username, fullname and passwords.",
    });
    return;
  }
  // Check that password and confirmPassword are the same
  if (password !== confirmPassword) {
    res.status(400).render("auth/signup", {
      errorMessage: "Passwords do not match",
    });
    return;
  }

  if (password.length < 8) {
    res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
    return;
  }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        fullname,
        email,
        password: hashedPassword,
      });
    })
    .then((user) => {
      // TODO: Update this
      res.redirect("/login");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render("auth/signup", {
          errorMessage:
            "Username and email need to be unique. Provide a valid username or email.",
        });
      } else {
        next(error);
      }
    });
};

// Function to handle user login
const login = (req, res, next) => {
  const { email, password } = req.body;

  // Check that username, email, and password are provided
  if (email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
        "All fields are mandatory. Please provide email and password.",
    });
    return;
  }

  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
        return;
      }

      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Wrong credentials." });
            return;
          }

          req.session.currentUser = user.toObject();
          delete req.session.currentUser.password;
          // req.app.locals.currentUser = req.session.currentUser;

          res.redirect("/");
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

// Function to handle user logout
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("auth/logout", { errorMessage: err.message });
      return;
    } else {
      req.app.locals.currentUser = null;
    }

    res.redirect("/");
  });
};

const getProfile = (req, res, next) => {
  const { currentUser } = req.session;

  User.findById(currentUser._id)
    .then((user) => {
      res.render("profile", { user });
    })
    .catch((error) => {
      next(error);
    });
};

const updateProfile = (req, res, next) => {
  const { fullname, username, twitch } = req.body;
  const currentUser = req.session;

  User.findByIdAndUpdate(
    currentUser._id,
    {
      fullname,
      username,
      profilePicture:
        req.file != null ? req.file.profilePicture : currentUser.profilePicture,
      twitch: twitch != null ? twitch : currentUser.twitch,
    },
    { new: true }
  );

  res.redirect("/profile");
};

module.exports = { getProfile, updateProfile, signup, login, logout };
