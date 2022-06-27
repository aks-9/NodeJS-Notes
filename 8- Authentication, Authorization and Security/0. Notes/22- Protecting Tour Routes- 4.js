//* 14- Protecting Tour Routes- 4

//? Creating an instance method to check if the password was changed after issueing the JWT.

// This 'userModel.js' file

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
  passwordChangedAt: Date, // adding
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//* creating an instance method.
// 'JWTTimestamp' means the time at which a token was issued. If the user has changed the password, then the 'passwordChangedAt' property will exist on the document. Otherwise it will not be there.
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      //parsing into a int value.
      this.passwordChangedAt.getTime() / 1000, //converting the milliseconds to seconds
      10 //specifying the base. Here the base is 10.
    );

    return JWTTimestamp < changedTimestamp; // If JWTTimestamp = 100 < changedTimestamp = 200 . This will return true, that means changed. If JWTTimestamp = 500 < changedTimestamp = 100 . This will return false, that means NOT changed.
  }

  // False means NOT changed. This is default return of this function.
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
