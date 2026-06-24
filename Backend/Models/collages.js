const mongoose = require("mongoose");

const collageSchema = new mongoose.Schema(
  {
    college_id: { type: String },
    college_name: { type: String },
    branch: { type: String },
    gm_rank: { type: Number },
    sc_rank: { type: Number },
    st_rank: { type: Number },
    obc_rank: { type: Number },
  },
  { timestamps: true }
);

const collage = mongoose.model("collage", collageSchema);
module.exports = collage;
