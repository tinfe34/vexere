const Branch = require("../models/branch");

const postBranch = async (req, res) => {
  //check branch
  try {
    const foundedBranch = await Branch.findOne({ code: req.body.code });

    if (foundedBranch) {
      return res.status(400).send({ message: "Branch already exist!!" });
    }

    const newBranch = new Branch({
      name: req.body.name,
      hotline: req.body.hotline,
      code: req.body.code,
      address: req.body.address,
    });

    const result = await newBranch.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

module.exports = {
  postBranch,
};
