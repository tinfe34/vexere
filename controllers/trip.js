const Ticket = require("../models/ticket");
const Trip = require("../models/trip");
const mongoose = require("mongoose");

// transaction: tạo ra một chuỗi action, mà 1 trong số đó thất bại,
// từ rollback ;lại trạng thái ban đầu

const postBookTrip = async (req, res) => {
  //input
  const { tripId, seatId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //kiểm tra
    const foundedTrip = await Trip.findById(tripId).session(session);

    if (!foundedTrip)
      return res
        .status(400)
        .send({ message: "invalid trip. Id is not exist!" });

    const foundedIndex = foundedTrip.seats.findIndex(
      (item) => item._id.toString() === seatId && item.status === "available"
    );

    if (foundedIndex === -1)
      return res.status(400).send({ message: "invalid seat." });

    // update trạng thái ghế
    foundedTrip.seats[foundedIndex].user = req.user._id;
    foundedTrip.seats[foundedIndex].status = "booked";

    await foundedTrip.save();

    console.log("saved trip!!!");

    // tạo ticket
    await Ticket.create(
      [
        {
          user: req.user._id,
          trip: foundedTrip._id,
          seats: [foundedTrip.seats[foundedIndex]],
        },
      ],
      { session: session }
    );

    console.log("saved ticket!!!");

    await session.commitTransaction();
    session.endSession();

    res.send({ message: "Book ticket successfully!!" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).send({ message: "Something went wrong!!" });
  }
};

module.exports = {
  postBookTrip,
};
