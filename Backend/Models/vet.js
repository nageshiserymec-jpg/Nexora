const mongoose = require("mongoose");

const vetSchema = new mongoose.Schema(
  {
    college_id: { type: String },
    college_name: { type: String },
    gm_rank: { type: Number },
  },
  { timestamps: true }
);

const vet = mongoose.model("vet", vetSchema);
module.exports = vet;
