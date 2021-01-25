const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const { auth } = require("../helpers/auth");
const config = require("config");

const sgAPIKey = config.get("sgAPIKey");

sgMail.setApiKey(sgAPIKey);

const User = require("../models/user");

router.post("/signup", async (req, res) => {
  const { username, password, email, phone } = req.body;

  try {
    const foundedUser = await User.findOne().or([{ username }, { email }]);
    if (foundedUser) res.status(400).send({ message: "User already exist!!!" });

    const newUser = new User({
      username,
      password,
      email,
      phone,
      role: "user",
    });

    let result = await newUser.save();
    result = result.toObject();
    delete result.password;

    //send email welcome
    sgMail
      .send({
        from: "hieu@covergo.com",
        to: result.email,
        subject: "Welcome to vexere",
        html: "<h1 style='color: red'>Welcomeeee</h1>",
      })
      .then((res) => {
        console.log("success");
      })
      .catch((err) => {
        console.log(err);
      });

    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something went wrong" });
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  //check username
  const foundedUser = await User.findOne({ username });
  if (!foundedUser) {
    return res
      .status(401)
      .send({ message: "Tài khoản hoặc mật khẩu không đúng" });
  }

  //check password
  const isMatch = await bcrypt.compare(password, foundedUser.password);
  if (!isMatch)
    return res
      .status(401)
      .send({ message: "Tài khoản hoặc mật khẩu không đúng" });

  //generate token
  const token = await jwt.sign(
    {
      _id: foundedUser._id,
    },
    "vexerejwt"
  );

  // save token vào user login
  foundedUser.tokens.push(token);
  await foundedUser.save();

  //send token về cho frontebd
  //send result
  res.send(token);
});

router.get("/me", auth(), async (req, res) => {
  const result = req.user.toJSON();
  res.send(result);
});

router.post("/logout", auth(), async (req, res) => {
  const index = req.user.tokens.findIndex((token) => token === req.token);
  req.user.tokens.splice(index, 1);

  await req.user.save();
  res.send();
});

router.post("/logoutAll", auth(), async (req, res) => {
  const newTokens = req.user.tokens.filter((token) => token === req.token);
  req.user.tokens = newTokens;

  await req.user.save();
  res.send();
});

module.exports = router;
