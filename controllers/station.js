const Station = require("../models/station");

const postStation = async (req, res) => {
  const { name, address, province, code } = req.body;
  try {
    const foundStation = await Station.findOne({ code });
    if (foundStation)
      return res.status(400).send({ message: "Station already existed!!" });

    const newStation = new Station({
      name,
      address,
      province,
      code,
    });

    const result = await newStation.save();
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
};

const deleteStation = async (req, res) => {
  const { id } = req.query;
  try {
    const result = await Station.findByIdAndDelete(id);
    res.send(result);
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
};

module.exports = {
    postStation,
    deleteStation
}
