const express = require("express");
const router = express.Router();

// Import the controller functions for tournament operations
const {
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
} = require("../controllers/tournamentController");

const isLoggedIn = require("../middleware/isLoggedIn");

// Route for getting all tournaments
router.get("/tournaments", getAllTournaments);

// Route for getting tournament details by ID
router.get("/tournaments/:tournamentId", getTournamentById);

// Route for creating a new tournament
router.post("/tournaments", isLoggedIn, createTournament);

// Route for updating tournament details by ID
router.put("/tournaments/:tournamentId", isLoggedIn, updateTournamentById);

// Route for deleting a tournament by ID
router.delete("/tournaments/:tournamentId", isLoggedIn, deleteTournamentById);

// Route for getting registrations for a tournament by ID
router.get(
  "/tournaments/:tournamentId/registrations",
  getTournamentRegistrations
);

// Route for adding a registration for a tournament by ID
router.post(
  "/tournaments/:tournamentId/registrations",
  isLoggedIn,
  addTournamentRegistration
);

// Route for creating a new stage for a tournament by ID
router.post(
  "/tournaments/:tournamentId/stages",
  isLoggedIn,
  createTournamentStage
);

// Route for updating a stage for a tournament by ID and stage ID
router.put(
  "/tournaments/:tournamentId/stages/:stageId",
  isLoggedIn,
  updateTournamentStageById
);

// Route for deleting a stage from a tournament by ID and stage ID
router.delete(
  "/tournaments/:tournamentId/stages/:stageId",
  isLoggedIn,
  deleteTournamentStageById
);


// Route for setting a match winner for a tournament's stage and match
router.put(
  "/tournaments/:tournamentId/stages/:stageId/matches/:matchId/set-winner",
  isLoggedIn,
  setMatchWinner
);




module.exports = router;
