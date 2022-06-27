//* Deleting the current user data

//This is 'userController.js'

//? When user wants to delete itself, we don't really delete it from the database, instead we make it 'inactive' so that if a user wants, at a later time the user can re-activate its account.

/*

Go to 'userModel.js' file and in the 'userSchema' add:

active: {
    type: Boolean,
    default: true,
    select: false // hiding from output
  }

*/

const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

//* Allowing user to set itself inactive.
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false }); //setting the 'active' flag to 'false' to make a user 'inactive'.

  res.status(204).json({
    status: "success",
    data: null, // 'null' means no data is being sent.
  });
});

/* Now go to 'userRoutes.js' file and add:

router.delete('/deleteMe', authController.protect, userController.deleteMe); // Using 'delete' http method.

*/

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

/*
Now go to Postman, {{URL}}api/v1/users/deleteMe and save it as  Delete Current User

Now go to Authorization tab, and select 'Bearer Token'. After that we don't need to pass any data in body or URL, as the only data required is user ID and that is coming from JWT.

And upon sending the request we should get code '204'. That means we have set the 'active' flag of this particular user to 'false'.

But right now the inactive user will still be visible in the Get All Users output. To fix that we'll use a query middleware.

---------------------------------------------------------

Go to 'userModel.js' file and add a query middleware:

userSchema.pre(/^find/, function(next) { //* using a regular expression to apply to all methods starting with 'find'.
  //* 'this' points to the current query. Before we execute the 'find' query from 'getAllUsers' handler function, we want to add something to it. Which is, we only want to add documents, which have 'active' property set to 'true', better yet, not equal to 'false'. As other documents will have have 'active' property by default.
  
  this.find({ active: { $ne: false } }); // passing a filter object in 'find' with 'active' property 
  next();
});


-----------------------------------------------


==> Now if we try to Get All Users, it will only show active users and not the inactive one in the output.





*/
