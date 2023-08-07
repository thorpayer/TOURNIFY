const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stageSchema = new Schema({
  name: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  matches: [{ type: Schema.Types.ObjectId, ref: 'Match' }],
}, { timestamps: true });

const Stage = mongoose.model('Stage', stageSchema);
module.exports = Stage;
