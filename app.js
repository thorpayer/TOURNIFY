// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
const formatDate = require("./utils/format.date");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// Add partials
hbs.registerPartials(__dirname + "/views/partials/");
hbs.registerHelper("formatDate", formatDate);
hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 === arg2 ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("formatDateForHTML", function (dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
});

hbs.registerHelper("getPlatformIcon", function (gamePlatform) {
  switch (gamePlatform) {
    case "XBox":
      return "/images/xbox.svg";
    case "PC":
      return "/images/pc.svg";
    case "Playstation":
      return "/images/playstation.svg";
    case "Mobile":
      return "/images/phone.svg";
    default:
      return "/images/game.svg";
  }
});

const capitalize = require("./utils/capitalize");
const projectName = "tournify";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

app.use(function (req, res, next) {
  app.locals.currentUser = req.session.currentUser;
  next();
});

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
const tournamentRoutes = require("./routes/tournament.routes");
const matchRoutes = require("./routes/match.routes");

app.use("/", authRoutes);
app.use("/tournaments", tournamentRoutes);
app.use("/matches", matchRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
