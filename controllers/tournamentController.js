const TournamentModel = require("../models/Tournament.model");
const UserModel = require("../models/User.model");
const StageModel = require("../models/Stage.model");
const MatchModel = require("../models/Match.model");

// TODO: add cloudinary and update banner
const createTournament = async (req, res, next) => {
  const {
    name,
    description,
    gamePlatform,
    game,
    banner,
    startDate,
    endDate,
    fee,
    location,
    prize,
  } = req.body;

  const currentUser = req.session.currentUser;

  try {
    await TournamentModel.create({
      name,
      description,
      gamePlatform,
      game,
      banner,
      startDate,
      endDate,
      fee,
      location,
      prize,
      banner: req.file.path,
      creator: currentUser._id,
    });
    res.redirect("/tournaments/my-tournaments");
  } catch (error) {
    next(error);
  }
};

const createTournamentPage = async (req, res, next) => {
  try {
    res.render("tournaments/create-tournament");
  } catch (error) {
    next(error);
  }
};

const getAllMyTournaments = async (req, res, next) => {
  try {
    const userId = req.session.currentUser._id;

    // Fetch the tournaments in which the user has participated (joined)
    const joinedTournaments = await TournamentModel.find({
      registrations: userId,
    }).exec();

    // Fetch the tournaments created by the user
    const createdTournaments = await TournamentModel.find({
      creator: userId,
    }).exec();

    res.status(201).render("tournaments/my-tournaments", {
      joinedTournaments,
      createdTournaments,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTournaments = async (req, res, next) => {
  try {
    const { status, gamePlatform } = req.query;

    // Build the query object based on the provided search parameters
    const query = {};
    if (status) {
      query.status = status;
    }
    if (gamePlatform) {
      query.gamePlatform = gamePlatform;
    }

    // Fetch tournaments from the database based on the query
    const tournaments = await TournamentModel.find(query).exec();

    // Separate tournaments based on their status
    const upcomingTournaments = tournaments.filter(
      (tournament) => tournament.status === "not started"
    );

    const ongoingTournaments = tournaments.filter(
      (tournament) => tournament.status === "ongoing"
    );

    const completedTournaments = tournaments.filter(
      (tournament) => tournament.status === "completed"
    );

    res.render("tournaments/tournaments", {
      tournaments: [...upcomingTournaments, ...ongoingTournaments],
      completedTournaments,
    });
  } catch (error) {
    next(error);
  }
};

const getTournamentById = async (req, res, next) => {
  const { tournamentId } = req.params;
  try {
    // Find the tournament by its ID
    const tournament = await TournamentModel.findById(tournamentId)
      .populate(["stages", "registrations"])
      .exec();
    res.render("tournaments/tournament-details", tournament);
  } catch (error) {
    next(error);
  }
};

const getTournamentToUpdate = async (req, res, next) => {
  const { tournamentId } = req.params;
  try {
    // Find the tournament by its ID
    const tournament = await TournamentModel.findById(tournamentId).exec();

    if (
      tournament &&
      req.session.currentUser._id === tournament.creator.toHexString()
    ) {
      res.render("tournaments/edit-tournament", {
        tournament,
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
};

const updateTournamentById = async (req, res, next) => {
  const { tournamentId } = req.params;

  const {
    name,
    description,
    gamePlatform,
    game,
    banner,
    startDate,
    endDate,
    fee,
    location,
    prize,
  } = req.body;

  console.log(req.body);

  // if (req.file) {
  //   console.log(req.file.path);
  // }

  try {
    const tournament = await TournamentModel.findById(tournamentId).exec();

    if (tournament.creator.toHexString() === req.session.currentUser._id) {
      // Find the tournament by its ID and update it
      const updatedTournament = await TournamentModel.findByIdAndUpdate(
        tournamentId,
        {
          name,
          description,
          gamePlatform,
          game,
          banner,
          startDate,
          endDate,
          fee,
          location,
          prize,
          banner: req.file != null ? req.file.path : tournament.banner,
        },
        { new: true } // Return the updated tournament
      ).exec();
      if (!updatedTournament) {
        return res.redirect(`/tournaments/${tournamentId}/edit`);
      }
      res.redirect("/tournaments/my-tournaments");
    } else {
      res.redirect("/tournaments/my-tournaments");
    }
  } catch (error) {
    next(error);
  }
};

const deleteTournamentById = async (req, res, next) => {
  const { tournamentId } = req.params;

  try {
    // Find the tournament by its ID and delete it
    await TournamentModel.findByIdAndDelete(tournamentId).exec();
    res.redirect("tournaments/my-tournaments");
  } catch (error) {
    next(error);
  }
};

const getTournamentRegistrations = async (req, res, next) => {
  const { tournamentId } = req.params;

  try {
    // Find the tournament by its ID and populate the registrations field with User data
    const tournament = await TournamentModel.findById(tournamentId)
      .populate("registrations")
      .exec();

    res.render("tournaments/tournament-registrations", {
      tournament,
    });
  } catch (error) {
    next(error);
  }
};

const addTournamentRegistration = async (req, res, next) => {
  const { tournamentId } = req.params;
  const { _id } = req.session.currentUser;

  try {
    if (_id) {
      // Find the tournament by its ID
      const tournament = await TournamentModel.findById(tournamentId).exec();

      // Check if the user is already registered
      if (tournament.registrations.includes(_id)) {
        return res.status(400).redirect("/tournaments/my-tournaments");
      }

      // Add the user's ID to the tournament's registrations array
      tournament.registrations.push(_id);
      await tournament.save();

      // show all registered tournaments after registration
      res.status(200).redirect("/tournaments/my-tournaments");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    next(error);
  }
};

const createTournamentStage = async (req, res, next) => {
  const { tournamentId } = req.params;
  const { name, start_date, end_date } = req.body;

  try {
    // Find the tournament by its ID
    const tournament = await TournamentModel.findById(tournamentId).exec();

    // Create a new stage using stageData
    const newStage = await StageModel.create({ name, start_date, end_date });

    // Push the new stage's ID into the tournament's stages array
    tournament.stages.push(newStage._id);
    await tournament.save();

    res.status(201).redirect(`/tournaments/${tournamentId}`);
  } catch (error) {
    next(error);
  }
};

const updateTournamentStageById = async (req, res, next) => {
  const { tournamentId, stageId } = req.params;
  const updatedStageData = req.body;

  try {
    // Find the stage by its ID
    await StageModel.findByIdAndUpdate(
      stageId,
      updatedStageData,
      { new: true } // Return the updated stage
    ).exec();

    // TODO: add tournement id
    res.status(200).redirect(`/tournaments/${tournamentId}`);
  } catch (error) {
    next(error);
  }
};

const deleteTournamentStageById = async (req, res, next) => {
  const { tournamentId, stageId } = req.params;

  try {
    // Find the tournament by its ID
    const tournament = await TournamentModel.findById(tournamentId).exec();

    // Find the stage by its ID and delete
    await StageModel.findByIdAndDelete(stageId).exec();

    // Remove the stage's ID from the tournament's stages array
    if (tournament) {
      tournament.stages.pull(stageId);
      await tournament.save();
    }

    res.redirect(`/tournaments/my-tournaments`);
  } catch (error) {
    next(error);
  }
};

const updateTournamentStatus = async (req, res, next) => {
  const { tournamentId } = req.params;
  const { newStatus } = req.body;

  try {
    // Find the tournament by its ID
    const tournament = await TournamentModel.findById(tournamentId).exec();

    if (tournament) {
      // Update the tournament's status
      tournament.status = newStatus;
      await tournament.save();
    }

    res.status(200).render(`/tournaments/${tournament}`);
  } catch (error) {
    // Handle any errors that occur during the process
    next(error);
  }
};

// =========== Matches ===================
const createMatch = async (req, res, next) => {
  const { tournamentId, stageId } = req.params;
  const { player1, player2 } = req.body;

  try {
    // Find the stage by its ID
    const stage = await StageModel.findById(stageId).exec();

    // Push the new match's ID into the stage's matches array
    if (stage) {
      // Create a new match using player1 and player2 details
      const newMatch = await MatchModel.create({ player1, player2 });

      // add match to stage
      stage.matches.push(newMatch._id);
      await stage.save();
    }
    res.status(201).redirect(`/tournaments/${tournamentId}`);
  } catch (error) {
    next(error);
  }
};

// // Function to get match details by match ID
// const getMatchById = async (req, res, next) => {
//   const { tournamentId, matchId } = req.params;

//   try {
//     // Find the match by its ID
//     const match = await MatchModel.findById(matchId).exec();

//     if (!match) {
//       return res.status(404).render(`/tournament/${tournamentId}`, {
//         errorMessage: "Match not found",
//       });
//     }

//     res.status(200).render("match_details", {
//       match,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// Function to update match details by match ID
const updateMatchById = async (req, res, next) => {
  const { tournamentId, matchId } = req.params;
  const updatedMatchData = req.body;

  try {
    // Find the match by its ID and update it
    await MatchModel.findByIdAndUpdate(
      matchId,
      updatedMatchData,
      { new: true } // Return the updated match
    ).exec();

    res.redirect(`/tournaments/${tournamentId}`);
  } catch (error) {
    next(error);
  }
};

// Function to update match details by match ID
const deleteMatchById = async (req, res, next) => {
  const { tournamentId, matchId, stageId } = req.params;

  try {
    // Find the match by its ID and delete it
    await MatchModel.findByIdAndDelete(matchId).exec();

    const stage = StageModel.findById(stageId);

    if (stage) {
      stage.matches.pull(matchId);
    }

    res.redirect(`/tournaments/${tournamentId}`);
  } catch (error) {
    // Handle any errors that occur during the deletion process
    next(error);
  }
};

const setMatchWinner = async (req, res, next) => {
  const { matchId, tournamentId } = req.params;
  const { winnerId } = req.body;

  try {
    // Find the match by its ID
    const match = await MatchModel.findById(matchId).exec();

    // Update the match with the winner's ID
    match.winner = winnerId;
    await match.save();

    res.status(200).redirect(`/tournements/${tournamentId}`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMatch,
  // getMatchById,
  updateMatchById,
  deleteMatchById,
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournamentById,
  deleteTournamentById,
  getTournamentRegistrations,
  addTournamentRegistration,
  setMatchWinner,
  createTournamentStage,
  updateTournamentStageById,
  deleteTournamentStageById,
  getAllMyTournaments,
  updateTournamentStatus,
  createTournamentPage,
  getTournamentToUpdate,
};
