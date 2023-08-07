const TournamentModel = require("../models/Tournament.model");

const createTournament = async (req, res) => {
  const tournamentData = req.body;

  try {
    // Create a new tournament using tournamentData
    const newTournament = await TournamentModel.create(tournamentData);
    res.redirect("/my-tournaments");
  } catch (error) {
    // Handle any errors that occur during the creation process
    res
      .status(500)
      .render("error", { error: "Failed to create the tournament" });
  }
};

const getAllMyTournaments = async (req, res) => {
  try {
    const userId = req.session.currentUser._id; // Assuming the user's ID is stored in req.user._id after authentication

    // Fetch the tournaments in which the user has participated (joined)
    const joinedTournaments = await TournamentModel.find({
      registrations: userId,
    }).exec();

    // Fetch the tournaments created by the user
    const createdTournaments = await TournamentModel.find({
      creator: userId,
    }).exec();

    res.render("my_tournaments", {
      joinedTournaments,
      createdTournaments,
    });
  } catch (error) {
    // Handle any errors that occur during the fetching process
    res.status(500).render("error", { errorMessage: "Internal Server Error" });
  }
};

const getAllTournaments = async (req, res) => {
  try {
    // Fetch all tournaments from the database
    const tournaments = await TournamentModel.find().exec();

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

    res.render("tournaments", {
      upcomingTournaments,
      ongoingTournaments,
      completedTournaments,
    });
  } catch (error) {
    // Handle any errors that occur during the fetching process
    res.status(500).render("error", { errorMessage: "Internal Server Error" });
  }
};

const getTournamentById = (req, res) => {
  const tournamentId = req.params.tournamentId;
  // Your logic to find the tournament by tournamentId
  // and send the response.
};

const updateTournamentById = (req, res) => {
  const tournamentId = req.params.tournamentId;
  const updatedTournamentData = req.body;
  // Your logic to update the tournament with tournamentId
  // using updatedTournamentData and send the response.
};

const deleteTournamentById = (req, res) => {
  const tournamentId = req.params.tournamentId;
  // Your logic to delete the tournament with tournamentId
  // and send the response.
};

const getTournamentRegistrations = (req, res) => {
  const tournamentId = req.params.tournamentId;
  // Your logic to fetch registrations for the tournament with tournamentId
  // and send the response.
};

const addTournamentRegistration = (req, res) => {
  const tournamentId = req.params.tournamentId;
  const userId = req.body.userId;
  // Your logic to add the registration for the user with userId
  // to the tournament with tournamentId and send the response.
};

const createTournamentStage = (req, res) => {
  const tournamentId = req.params.tournamentId;
  const stageData = req.body;
  // Your logic to create a new stage using stageData
  // for the tournament with tournamentId and send the response.
};

const updateTournamentStageById = (req, res) => {
  const { tournamentId, stageId } = req.params;
  const updatedStageData = req.body;
  // Your logic to update the stage with stageId
  // for the tournament with tournamentId using updatedStageData
  // and send the response.
};

const deleteTournamentStageById = (req, res) => {
  const { tournamentId, stageId } = req.params;
  // Your logic to delete the stage with stageId
  // for the tournament with tournamentId and send the response.
};

// =========== Matches ===================
const createMatch = (req, res) => {
  const stageId = req.params.stageId;
  const { player1, player2 } = req.body;
  // Your logic to create a new match in the stage with stageId,
  // using player1 and player2 details, and send the response.
};

// Function to get match details by match ID
const getMatchById = (req, res) => {
  const matchId = req.params.matchId;
  // Your logic to find the match by matchId
  // and send the response.
};

// Function to update match details by match ID
const updateMatchById = (req, res) => {
  const matchId = req.params.matchId;
  const updatedMatchData = req.body;
  // Your logic to update the match with matchId
  // using updatedMatchData and send the response.
};

// Function to update match details by match ID
const deleteMatchById = (req, res) => {
  const matchId = req.params.matchId;
  // Your logic to delete the match with matchId
  // and send the response.
};

const setMatchWinner = (req, res) => {
  const { tournamentId, stageId, matchId } = req.params;
  const winnerId = req.body.winnerId;
  // Your logic to set the winner with winnerId for the match with matchId
  // in the stage with stageId for the tournament with tournamentId
  // and send the response.
};

module.exports = {
  createMatch,
  getMatchById,
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
};
