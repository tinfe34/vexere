const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    email: String,
    phone: String,
    role: String,
    tokens: {
      type: [String],
      default: [],
    },
    avatar: String,
  },
  {
    timestamps: true,
  }
);
//methods

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.tokens;
  return user;
};

userSchema.pre("save", async function (next) {
  //hash password
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
