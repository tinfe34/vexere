const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require('config')

const jwtSignature = config.get('jwtSignature')

const auth = (roles) => async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await jwt.verify(token, jwtSignature);
    const allowRoles = roles || ["admin", "user"];

    const foundedUser = await User.findOne({
      _id: decoded._id,
      tokens: token,
      role: { $in: allowRoles },
    });

    if (!foundedUser)
      return res.status(401).send({ message: "you are not authorized!!" });

    req.user = foundedUser;
    req.token = token;

    next();
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: "you are not authorized!!" });
  }
};

module.exports = {
  auth,
};
