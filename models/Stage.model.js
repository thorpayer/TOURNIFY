const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stageSchema = new Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
}, { timestamps: true });

const Stage = mongoose.model('Stage', stageSchema);
module.exports = Stage;
