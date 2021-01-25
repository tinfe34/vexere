const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    provice: String,
    code: String,
  },
  {
    timestamps: true,
  }
);

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
