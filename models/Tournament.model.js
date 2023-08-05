const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tournamentSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    gamePlatform: {
      type: String,
      enum: ["PC", "XBox", "Playstation", "Mobile"],
    },
    game: { type: String, required: true },
    banner: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    fee: { type: Number, required: true },
    mode: { type: String, required: true },
    prize: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stages: [{ type: Schema.Types.ObjectId, ref: "Stage" }],
    registrations: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["not started", "ongoing", "paused", "completed"],
      default: "not started",
    },
  },
  { timestamps: true }
);

const Tournament = mongoose.model("Tournament", tournamentSchema);
module.exports = Tournament;
