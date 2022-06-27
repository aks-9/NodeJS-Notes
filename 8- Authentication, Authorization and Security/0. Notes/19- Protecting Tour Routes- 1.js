//* 12- Protecting Tour Routes- 1

// This is authController.js

//? Here we will create a 'protect' middleware that will run before the middleware we want to protect from unauthorized access. And then send the jwt token in 'authorization' header along with the request, to access the protected content.

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

  const token = signToken(user._id);

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
  // Common practice is to send the token using an 'http' header, with the request. There is a standard for doing this, and the header used for it is called 'authorization'. The value of this 'authorization' header always starts with 'Bearer' followed by a space, and then the token.

  //So we will check if there is a 'authorization' header in the request and has a value that starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; //splitting the string and saving it into an array with 2 elements. Then accessing the second element that has our token.
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401) //401 code is for Unauthorized.
    );
  }

  next();
});

/* 
Go to 'tourRoutes.js' file and import:

const authController = require('./../controllers/authController');

then add this:

router
  .route('/')
  .get(authController.protect, tourController.getAllTours) //* 'protect' middleware will run first, before 'getAllTours'.
  .post(tourController.createTour);
*/

/*

Now if we go to  Get All Tours in Postman, and in 'Headers' section, pass 'Athorization' header and its value= Bearer fa35iguoiaglkqlwet79dasdvkakdg294rlkdds.

Then it will trigger the '.protect' middleware and we will only be allowed in if the token is correct. Make sure the token value is from a newly signed up user, or from the database.

*/
