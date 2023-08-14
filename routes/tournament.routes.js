const express = require("express");
const router = express.Router();
const fileUploader = require("../config/cloudinary.config");

// Import the controller functions for tournament operations
const {
  getAllTournaments,
  getTournamentById,
  getAllMyTournaments,
  createTournament,
  updateTournamentById,
  deleteTournamentById,
  getTournamentRegistrations,
  addTournamentRegistration,
  setMatchWinner,
  createTournamentStage,
  updateTournamentStageById,
  createTournamentPage,
  deleteTournamentStageById,
} = require("../controllers/tournamentController");

const isLoggedIn = require("../middleware/isLoggedIn");

// Route for getting all tournaments
router.get("/", getAllTournaments);

// Route for creating a new tournament
router.post(
  "/create-tournament",
  isLoggedIn,
  fileUploader.single("banner"),
  createTournament
);

// show create tournament form
router.get("/create-tournament", createTournamentPage);

// Route for all my tournaments
router.get("/my-tournaments", isLoggedIn, getAllMyTournaments);

// Route for getting tournament details by ID
router.get("/:tournamentId", getTournamentById);

// Route for updating tournament details by ID
router.put("/:tournamentId", isLoggedIn, updateTournamentById);

// Route for deleting a tournament by ID
router.delete("/:tournamentId", isLoggedIn, deleteTournamentById);

// Route for getting registrations for a tournament by ID
router.get("/:tournamentId/registrations", getTournamentRegistrations);

// Route for adding a registration for a tournament by ID
router.post(
  "/:tournamentId/registrations",
  isLoggedIn,
  addTournamentRegistration
);

// Route for creating a new stage for a tournament by ID
router.post("/:tournamentId/stages", isLoggedIn, createTournamentStage);

// Route for updating a stage for a tournament by ID and stage ID
router.put(
  "/:tournamentId/stages/:stageId",
  isLoggedIn,
  updateTournamentStageById
);

// Route for deleting a stage from a tournament by ID and stage ID
router.delete(
  "/:tournamentId/stages/:stageId",
  isLoggedIn,
  deleteTournamentStageById
);

// Route for setting a match winner for a tournament's stage and match
router.put(
  "/:tournamentId/stages/:stageId/matches/:matchId/set-winner",
  isLoggedIn,
  setMatchWinner
);

module.exports = router;
