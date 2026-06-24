const mongoose = require("mongoose");

const agriSchema = new mongoose.Schema(
  {
    college_id: { type: String },
    college_name: { type: String },
    gm_rank: { type: Number },
  },
  { timestamps: true }
);

const agri = mongoose.model("agri", agriSchema);
module.exports = agri;
