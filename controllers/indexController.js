const TournamentModel = require("../models/Tournament.model");

// Function to handle homepage
const index = async (req, res, next) => {
  // fecth all the ongoing and upcoming tournaments to show on the homepage
  Promise.all([
    TournamentModel.find({ status: "ongoing" })
      .populate(["creator", "stages", "registrations"])
      .exec(),
    TournamentModel.find({ status: "upcoming" })
      .populate(["creator", "stages", "registrations"])
      .exec(),
  ])
    .then(([ongoing, upcoming]) => {
      res.render("index", {
        ongoingTournaments: ongoing,
        upcomingTournaments: upcoming,
      });
    })
    .catch((error) => {
      // view generated error
      next(error);
    });
};

module.exports = { index };
