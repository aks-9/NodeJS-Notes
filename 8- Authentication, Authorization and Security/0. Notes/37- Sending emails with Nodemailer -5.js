//* Sending emails with Nodemailer -5

//This is 'authoController.js'

//? Sending the reset token to user's email using nodemailer.

/*
In Postman, goto  {{URL}}api/v1/users/resetPassword and save it as 'Reset Password', make sure it is a 'Patch' method, as it will modify the password property.


*/

const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email"); //importing the email module created in last lesson.

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //* 3) Sending the reset token to user's email using nodemailer.

  //Building reset url. 'Protocol' could be 'https' or 'http', we will get it from the request. Then getting the 'host', and lastly getting the 'resetToken'.
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    //Finally sending the email. And as it is an 'async' function, wrapping it in a 'try' and 'catch' block, just in case there is some error while sending the email. Also in this case, we need to do more than just send an error message. We need to set back the 'passwordResetToken' and the 'passwordResetExpires' that we defined in the user schema. So it's not enough to send an error to client using our global error handling middleware 'AppError' class here. Instead using 'try' and 'catch' block.
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    // sending a response
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined; //Resetting this property using 'undefined'.
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false }); //saving the changes to the database.

    return next(
      // now we can use our AppError class
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

/*
Now go to 'Forgot password' in Postman,

input:

{
    "email":"hello@jonas.io"
}


OUTPUT:

{
    "status": "success",
    "message": "Token sent to email!"
}


In out Mailtrap inbox, we will get this:

Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: http://127.0.0.1:3000/api/v1/users/resetPassword/5a429bafcfe23aa731cd158b038e42ebda392bb037cb737b2dc776e46f8cafc5.
If you didn't forget your password, please ignore this email!

You can match the reset token from console to the one in the reset url, and also in the database the encrypted token will match the one in the terminal's console.

*/
