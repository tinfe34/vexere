const mongoose = require("mongoose");
const { seatSchema } = require("./seat");

const tripSchema = new mongoose.Schema(
  {
    departurePlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
    },
    arrivalPlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
    },
    startedDate: Date,
    departureTime: Date,
    seats: [seatSchema],
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
    },
    price: Number,
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
