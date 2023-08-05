const express = require("express");
const router = express.Router();

// Require the matchController to handle match-related operations
const matchController = require("../controllers/matchController");
const isLoggedIn = require("../middleware/isLoggedIn");

// Route for creating a new match in a stage
router.post(
  "/tournaments/:tournamentId/stages/:stageId/matches",
  isLoggedIn,
  matchController.createMatch
);

// Route for getting match details by match ID
router.get(
  "/tournaments/:tournamentId/stages/:stageId/matches/:matchId",
  matchController.getMatchById
);

// Route for updating match details by match ID
router.put(
  "/tournaments/:tournamentId/stages/:stageId/matches/:matchId",
  isLoggedIn,
  matchController.updateMatchById
);

// Route for deleting a match by match ID
router.delete(
  "/tournaments/:tournamentId/stages/:stageId/matches/:matchId",
  isLoggedIn,
  matchController.deleteMatchById
);

// Route for setting a match winner by match ID
router.put(
  "/tournaments/:tournamentId/stages/:stageId/matches/:matchId/set-winner",
  isLoggedIn,
  matchController.setMatchWinner
);

module.exports = router;
