const mongoose = require("mongoose");

const phrSchema = new mongoose.Schema(
  {
    college_id: { type: String },
    college_name: { type: String },
    gm_rank: { type: Number },
  },
  { timestamps: true }
);

const phr = mongoose.model("phr", phrSchema);
module.exports = phr;
