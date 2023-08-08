const express = require("express");
const router = express.Router();

// Require thetournamentController to handle match-related operations
const tournamentController = require("../controllers/tournamentController");
const isLoggedIn = require("../middleware/isLoggedIn");

// Route for creating a new match in a stage
router.post(
  "/tournaments/:tournamentId/stages/:stageId/matches",
  isLoggedIn,
  tournamentController.createMatch
);

// // Route for getting match details by match ID
// router.get(
//   "/tournaments/:tournamentId/stages/:stageId/matches/:matchId",
//   tournamentController.getMatchById
// );

// Route for updating match details by match ID
router.put(
  "/tournaments/:tournamentId/stages/:stageId/matches/:matchId",
  isLoggedIn,
  tournamentController.updateMatchById
);

// Route for deleting a match by match ID
router.delete(
  "/tournaments/:tournamentId/stages/:stageId/matches/:matchId",
  isLoggedIn,
  tournamentController.deleteMatchById
);

// Route for setting a match winner by match ID
router.put(
  "/tournaments/:tournamentId/stages/:stageId/matches/:matchId/set-winner",
  isLoggedIn,
  tournamentController.setMatchWinner
);

module.exports = router;
