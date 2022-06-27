//* Authorization user roles and permissions -3

//This is 'authController.js' file.

//? Now back in 'authController.js' file, we will implement the  'restrictTo' middleware

const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

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

//Usually we can't pass arguments into a 'middleware' function, but here we need to pass the roles who has the access to a specific resource. So here we will create a new 'wrapper' function, which then returns the 'middleware' function that we actually want to create.
exports.restrictTo = (...roles) => {
  //Using REST parameter ES6 syntax. This will create an array of all the elements that were specified.
  // Now in return of this wrapper function, we will pass the 'middleware' function, and this 'middleware' function will get access to this 'roles' parameter as there is a closure of 'wrapper' function.
  return (req, res, next) => {
    // If the 'role' passed in the request is present in this roles array, that is  ['admin', 'lead-guide'] , only then the user will get access to a certain route. The 'role' passed in the request is in 'req.user.role', as we've already stored the 'currentUser' in the 'req.user', in the '.protect' handler function we wrote previously. And the 'protect' middleware always run before 'restrictTo' middle as we have written in our 'tourRoutes.js'.
    if (!roles.includes(req.user.role)) {
      // Using 'includes' array method
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

/*
 Now if we go to Postman and sign up a new user, we will get the default role as 'user', as we didn't explicitly mentioned any role while signing up.

 Input: 

 {
    "name":"jonas",
    "email":"hello@jonas.io",
    "password":"pass1234",
    "passwordConfirm":"pass1234"
}


 OUTPUT:

 "role": "user",

*/
