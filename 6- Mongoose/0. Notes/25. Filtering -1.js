//* Filtering -1

//This is 'tourController.js' file

//? Filtering using the query string.

/*
Go to Postman, and click on 'Get All Tours'. Then in the address bar, insert the query string:

127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy

So the query string looks a bit like above, we start with a '?', and then we can simply specify some field value pairs joined by '&'.

This will allow the user to filter the data that has duration=5, and difficulty=easy, so that instead of getting all the data, he only gets the data that matches the filter.
*/

const Tour = require("./../models/tourModel");

//Now to access the data in a query string, in our Express application.

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query); // the data in a query string is on a 'request', and then it is in a field called 'query'. So 'req.query' should then give us an object formatted with the data from the query string.

    const tours = await Tour.find();
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "success",
      message: err,
    });
  }
};

/* 

So go to the Postman app, and insert this query string:

127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy

OUTPUT in terminal:

{ duration: '5', difficulty: 'easy' }

==> Express parsed that query string into this, easy to use, object.

If the logger is not showing up in the console, then make sure that in the 'server.js' file, the 'app' is after the 'dotenv'.

OUTPUT in terminal:

{ duration: '5', difficulty: 'easy' }
GET /api/v1/tours?duration=5&difficulty=easy 200 73.569 ms - 9387


*/
