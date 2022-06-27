//* Logging in the registered users- 5

//* Instance Method.  A method that is going to be available on all of the documents of a certain collection.

//? Comparing the password. We will first get the password, then we will use the 'bcrypt' package and encrypt it. Then we will compare it with the encrypted password we have in the terminal. This will be done in the 'userModel.js' file as it is related to user data itself.

// this is 'userModel.js' file

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//* Instance method

// Calling 'correctPassword' function via instance method. 'candidatePassword' is the password that a user passes in the body of the request. The 'this' keyword points to the current document, but here the 'this.password' will not be available as we have set 'select' to 'false' in the schema. The goal of this function is to return 'true' or 'false' depending upon the comparision passes or fails.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); //Using compare function on 'bcrypt'
};

//Now we will call this instance method from 'authController'.

const User = mongoose.model("User", userSchema);

module.exports = User;
