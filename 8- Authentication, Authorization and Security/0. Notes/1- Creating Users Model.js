//* Creating Users Model

//? Create a new file 'userModel.js' in the Models folder.

// This is 'userModel.js' file.

const mongoose = require("mongoose");
const validator = require("validator"); // to validate the emails

//create schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email!"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
  },
});

//Crating model from schema
const User = mongoose.model("User", userSchema);

module.exports = User;
