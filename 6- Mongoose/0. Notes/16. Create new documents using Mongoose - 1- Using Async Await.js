//* Create new documents - 1

//This is 'tourController.js' file

//? A better way to create new documents in the database

const Tour = require("./../models/tourModel");

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
};

exports.createTour = async (req, res) => {
  //* Older method to crate a document:
  // const newTour = new Tours({});
  // newTour.save();

  //* New method to crate a document:
  const newTour = await Tour.create(req.body);
  // The main difference is that in this version here we call the "create" method directly on the 'Tour' model itself, while in this first version we called the 'save' method on the new document 'newTour'.

  // Remember how 'save' method here returned a promise. And so this 'create' here does return a promise as well. But instead of 'then' we're going to use 'async/await'. So we've to make this function an 'async' function, and use 'await' for 'Tour.create()'. Then we pass the data that we want to store in the database as a 'newTour'. And that data comes from the body via POST. And so that's stored inside of 'req.body'.

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tours: "<Updated tour here...>",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};

/* 
If there is a ES Lint error, go to 'package.json' file and add the following:

"engines": {
      "node": ">= 10.0.0"
    }

*/
