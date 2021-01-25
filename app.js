const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
//package để xây đường dẫn
const path = require("path");

const passport = require("passport");
const passportStrategy = require("passport-facebook-token");
require("./db/connect");
const jwt = require("jsonwebtoken");
passport.use(
  "facebookToken",
  new passportStrategy(
    {
      clientID: "122048523055525",
      clientSecret: "7a3a2e3023c2e161ceffc3d2a62485e7",
    },
    async (accessToken, refreshToken, profile, done) => {
       const userEmail = profile.emails[0].value;
       const userAvatar = profile.photos[0].value;
      const foundedUser = await User.findOne({email: userEmail});
       let user = foundedUser;
       if(!foundedUser){
          const  newUser = new User({
            email: userEmail,
            role: "user",
            avatar: userAvatar
          })
          user = await newUser.save();
       }
       done(null, user)
    }
  )
);

const tripRouter = require("./routers/trip");
const branchRouter = require("./routers/branch");
const carRouter = require("./routers/car");
const stationRouter = require("./routers/station");
const authRouter = require("./routers/auth");
const uploadRouter = require("./routers/upload");
const { access } = require("fs");
const User = require("./models/user");
var cors = require('cors')
const app = express();

/**
 * TODO
 *  .CRUD Branch
 *  .CRUD Car
 *  .CRUD Station
 *  .CRUD Trip
 *  .signup, signin, jwt, track tokens , authorization, logout ,log out all
 *  .Booking Ticket
 *  .Refactor - mvc, router,
 *  .Giới thiệu buffer - stream
 *  .Upload file - filter type,limit size, serve static file
 *  .Send email
 *  .Chat module
 *
 */

//closure

const imagesFolderPath = path.join(__dirname, "images");

app.use(cors({
  origin: "https://api-vxr-tin.herokuapp.com/",
  optionsSuccessStatus: 200,
}))

app.use(bodyParser.json());
app.use("/images", express.static(imagesFolderPath));

app.use(tripRouter);
app.use(branchRouter);
app.use(carRouter);
app.use(stationRouter);
app.use(authRouter);
app.use(uploadRouter);
app.post(
  "/login/facebook",
  passport.authenticate("facebookToken", { session: false }),
  async (req, res) => {
       //generate token
    const token = await jwt.sign(
      {
        _id: req.user._id,
      },
      "vexerejwt"
    );
    req.user.tokens.push(token);
    await req.user.save();
    return res.send({token})
  }
);
const port = process.env.PORT || config.get("port");

app.listen(port, () => {
  console.log("listening.....");
});
