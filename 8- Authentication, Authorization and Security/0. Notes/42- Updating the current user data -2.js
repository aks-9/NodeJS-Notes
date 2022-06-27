//* Updating the current user data -2

//This is 'userController.js'

//? Crating a filter object so as to only allow certain fields to be update, and not something sensitive like 'role'.

const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError"); //importing

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

//* creating a filter object to filter the properties that are not allowed to be updated.
// The first argument is the object from which we will filter the fields, the second is an array created using the 'Rest' parameter, which will have only the fields that are allowed.
const filterObj = (obj, ...allowedFields) => {
  const newObj = {}; //creating an empty object.

  Object.keys(obj).forEach((el) => {
    //looping through the 'obj' using 'Object.keys' and this will then return an array containing all the key names (field names of 'obj'), and then we can loop through them using the 'forEach' method.
    if (allowedFields.includes(el)) newObj[el] = obj[el]; //Then using 'includes' method on the 'allowedFields' array's current element, and then adding it to the 'newObj' object.
  });

  return newObj; //returning the 'newObj' object.
};

//* calling the 'filterObj' function.
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
  const filteredBody = filterObj(req.body, "name", "email"); //only 'name' and 'email' allowed, and not something like 'role'.

  // 3) Update user document

  //using 'findByIdAndUpdate' as we are not handling any sensitive data like passwords. The first argument is 'id', second is 'filtered data', and third is 'options'.
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, //will return updated object instead of old one.
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      //sending updated user
      user: updatedUser,
    },
  });
});

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
Go to Postman, Update Current User Data

Now if we try to update:

{
    "name": "Jonas",
    "role": "admin"
}


It will only update the 'name' and not the 'role'.

*/
