const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: [true, "Username already exists"],
  },
  first_name: {
    type: String,
    required: [true, "Please provide a first name"],
  },
  last_name: {
    type: String,
    required: [true, "Please provide a last name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    required: [true, "An account type is required"],
  },
  role: {
    type: String,
    required: [true, "A role is required"],
  },
  profile_pic: {
    type: String,
    default: "user.png",
  },
  gender: {
    type: String,
  },
  date_of_birth: {
    type: Date,
  },
  two_factor_auth: {
    type: Boolean,
    default: false,
  },
  two_factor_secret: {
    type: String,
  },
  rotu: {
    type: String,
    default: "user",
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
