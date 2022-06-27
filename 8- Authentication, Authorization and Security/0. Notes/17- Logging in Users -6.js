//* Logging in the registered users- 6

// this is 'authController.js' file

//? Calling the instance method in 'authController.js' to compare the passwords.

const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

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

  //* 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  //* 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password"); // 'user' is a user document, because its a result of quering a user model. So the instance method will be available on it.

  // const correct = await user.correctPassword(password, user.password); //Passing in the password from the body, and the user's password. Now 'correct' will either be 'true' or 'false'. Using await as 'correctPassword' is an 'async' function.

  // creating error if incorrect password or user doesn't exist.
  //moved the 'correct' into the if statement, because if a user doesn't exist then the user.correctPassword() can't run.
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  const token = "";
  res.status(200).json({
    status: "success",
    token,
  });
});

//
