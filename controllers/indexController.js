const TournamentModel = require("../models/Tournament.model");

// Function to handle homepage
const index = async (req, res, next) => {
  // fecth all the ongoing and upcoming tournaments to show on the homepage

  try {
    const ongoing = await TournamentModel.find({ status: "ongoing" })
      .populate(["creator", "stages", "registrations"])
      .exec();

    const upcoming = await TournamentModel.find({ status: "not started" })
      .populate(["creator", "stages", "registrations"])
      .exec();

    res.render("index", {
      ongoingTournaments: ongoing,
      upcomingTournaments: upcoming.slice(0, 6),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { index };
