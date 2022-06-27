//* Logging in the registered users- 4

// this is 'authController.js' file

//? Putting password field back in terminal console.

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

  // As we have implemented the 'select' field in the password property in 'userModel.js' file, the password is no longer available in the output. But now it is also not available in the 'findOne' function.

  // But we do need the password in order to check if it is correct. And so we need to explicitly select it as well. Now in this case where by default the field is not selected, we need to use '.select' and then '+' the name of the field.

  const user = await User.findOne({ email }).select("+password");
  console.log(user); //logging to the console where password will be visible.

  //* 3) If everything ok, send token to client
  const token = "";
  res.status(200).json({
    status: "success",
    token,
  });
});

//
