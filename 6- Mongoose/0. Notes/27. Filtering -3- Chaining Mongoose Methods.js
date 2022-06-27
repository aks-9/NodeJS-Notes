//* Filtering -3

//This is 'tourController.js' file

//? Use of some special Mongoose methods.

const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //* With the filter object, we would do it like this:
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy'
    // });

    //* Using some special Mongoose methods, we start chaining some special Mongoose method to basically build the query similar to the  earlier method.
    const tours = await Tour.find()
      .where("duration")
      .equals(5)
      .where("difficulty")
      .equals("easy");
    //And there are of course tons of other methods. For example, instead of 'equals', we can have 'lt' (less than), or 'lte' (less than or equal) , or you can also 'sort' the results or 'limit' the number of results.

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
We will still get same 2 results as in previous part.

input 127.0.0.1:3000/api/v1/tours?duration=5&difficulty=easy

it will only show 2 results in the output. Both will have duration=5 and difficulty=easy.
*/
