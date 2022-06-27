//* Setting new password -2

//This is 'userModel.js'

//? Updating the 'changedPasswordAt' property for the user using a pre document middleware.

const crypto = require("crypto");
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
    select: false, // hides password from client
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
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//* Update 'changedPasswordAt' property for the user
//Pre save document middlware.
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next(); //If the password is not modified, or the document is new

  this.passwordChangedAt = Date.now() - 1000; //updating the property. But sometimes saving to database is slower than issuing of JWT, so in practice we set this property a little bit after than the timestamp of issuing of JWT. That will not allow user to login using the new token. 'passwordChangedAt' needs to be compared with the timestamp of JWT. So we subtract one second (1000 milliseconds) from the timestamp. This will ensure that the token is always created after the password has been changed.
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

/*

Go to Postman, Forgot Password,

INPUT:
{
    "email":"hello@jonas.io"
}

OUTPUT:

{
    "status": "success",
    "message": "Token sent to email!"
}

Again, Copy the token from the Mailtrap inbox, and go to Postman, we'll use it in the Reset Password as the url id.

token from Mailtrap:
c6285bf80232d93390775dba8ab54bb12a925925bc1ef405c9de9b3c465bdf70

{{URL}}api/v1/users/resetPassword/c6285bf80232d93390775dba8ab54bb12a925925bc1ef405c9de9b3c465bdf70


INPUT:
{
    "password": "newpass123",
    "passwordConfirm": "newpass123"
}

OUTPUT:

{
    "status": "success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjczYmI5NGUwOTlhMjEwODNhZDRiYSIsImlhdCI6MTY1NjE4OTE5NCwiZXhwIjoxNjYzOTY1MTk0fQ.qvWsQEhkIC019RMLxfdjihxzzgXKEl5d3JLB2aDGkQ8"
}

==> Now if you go to database, you'll see the 'passwordChangedAt' property.

passwordChangedAt
2022-06-25T20:33:13.419+00:00

*/
