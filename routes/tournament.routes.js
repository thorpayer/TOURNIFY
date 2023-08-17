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
  getTournamentToUpdate,
  updateTournamentStatusById,
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
router.get("/create-tournament", isLoggedIn, createTournamentPage);

// Route for all my tournaments
router.get("/my-tournaments", isLoggedIn, getAllMyTournaments);

// Route for updating tournament details by ID
router.post(
  "/:tournamentId/update",
  isLoggedIn,
  fileUploader.single("banner"),
  updateTournamentById
);
router.get("/:tournamentId/edit", isLoggedIn, getTournamentToUpdate);

// Route for getting tournament details by ID
router.get("/:tournamentId", getTournamentById);

// Route for deleting a tournament by ID
router.post("/:tournamentId/delete", isLoggedIn, deleteTournamentById);

// Route for changing status of a tournament by ID
router.post("/:tournamentId/status", isLoggedIn, updateTournamentStatusById);

// Route for getting registrations for a tournament by ID
router.get("/:tournamentId/registrations", getTournamentRegistrations);

// Route for adding a registration for a tournament by ID
router.get("/:tournamentId/register", isLoggedIn, addTournamentRegistration);

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
