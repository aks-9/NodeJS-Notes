//* 13- Protecting Tour Routes- 2

//? Verification of JWT

// This is 'authController.js' file

const { promisify } = require("util"); // destructuring, importing promisify from 'util'
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

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

  //* 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  //* 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");
  //console.log(user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //* 3) If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //* 1) Getting token and check of it's there

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

  //* 2) Token Verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //using 'verify' method on 'jwt'. Also using 'promisify' to make it return a promise.

  /* 
  Go to errorController.js and add:

  const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

  const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);


  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

*/

  next();
});

/* 

*/
