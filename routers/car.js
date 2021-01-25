const express = require("express");
const Car = require("../models/car");
const router = express.Router();

router.post("/car", async (req, res) => {
    const { branchId, licensePlate, seats } = req.body;
  
    try {
      const foundCar = await Car.findOne({ licensePlate });
  
      if (foundCar)
        return res
          .status(400)
          .send({ message: "License plate already existed!!" });
  
      const newCar = new Car({
        branch: branchId,
        licensePlate,
        seats,
      });
  
      const result = await newCar.save();
      res.send(result);
    } catch (err) {
      res.status(500).send({ message: "Something went wrong" });
    }
  });


module.exports = router;
