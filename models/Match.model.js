const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const matchSchema = new Schema(
  {
    player1: { type: Schema.Types.ObjectId, ref: "User", required: true },
    player2: { type: Schema.Types.ObjectId, ref: "User", required: true },
    matchDate: { type: Date, required: false },
    stage: { type: Schema.Types.ObjectId, ref: "Stage" },
    winner: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["not started", "ongoing", "completed"],
      default: "not started",
    },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);
module.exports = Match;
