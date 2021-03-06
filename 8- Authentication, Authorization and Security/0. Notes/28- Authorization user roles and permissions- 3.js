//* Authorization user roles and permissions -2

//This is 'authController.js' file.

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

/*
Usually, we cannot pass arguments into a middleware function. But in this case, we really want to pass in the roles, who are allowed to access the resource. So in this case, those roles are the 'admin' and the 'lead guide'. So, we will actually create like a wrapper function, which will then return the middleware function that we actually want to create.
*/

exports.restrictTo = (...roles) => {
  // here we want to pass an arbitrary number of arguments of roles in 'restrictTo'. And so we can use the 'rest' parameter syntax, and this will then create an array of all the arguments that were specified.

  //And this is the middleware function itself. And so this middleware function here will then basically get access to this role's parameter here, because there is a closure.
  return (req, res, next) => {
    /*
     Let's say the array is roles ['admin', 'lead-guide'] and our is role='user'

     We will give a user access to a certain route, when its user role is inside of this roles array that we passed in.
    */
    if (!roles.includes(req.user.role)) {
      //'includes' is a an array method that is in Java Script available on all arrays. The current user is stored in 'req.user' from our 'protect' middleware. And remember how 'protect' middleware always runs before 'restrictTo'
      return next(
        //creating a new error
        new AppError("You do not have permission to perform this action", 403)
      ); //'403' is authorization error status code.
    }

    next();
  };
};

// Now if the request doesn't specify any role, then it would be automatically set to 'user'. But if there is a role set in the request, then we will check it is included in the arguent passed to 'restrictTo' middle  while being called in 'tourRoutes.js' file. If it is not in that list, then an error will be thrown.
