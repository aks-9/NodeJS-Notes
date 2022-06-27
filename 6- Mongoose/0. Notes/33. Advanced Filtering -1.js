//* Advanced Filtering -1

//This is 'tourController.js' file

//? Implementing the 'greater than', the 'greater or equal than', the 'less than', and the 'less or equal than 'operators.

const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    //* BUILD THE QUERY
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((element) => delete queryObj[element]);

    const query = Tour.find(queryObj);

    //* standard way of writing a query string including these operators in Postman. Notice the operator in [ ]
    //127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy

    console.log(req.query);

    /*
    This is how we would manually write the filter object for the query that we just specified.
     Filter Object 
     ==> { difficulty: 'easy' , duration: { $gte: 5 } }
     
     Go to Postman and make a request with 127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[gte]=5
     
     In the terminal, you will see the Query Object  
     ==> { difficulty: 'easy' , duration: { gte: '5' } }
        
    The query object looks almost identical to the filter object that we wrote manually, the only difference is that in the filter object one we have the MongoDB operator sign '$'. And so the solution for this is to basically replace all the operators like this with their correspondent MongoDB operators, so basically adding this '$' sign.

    */

    //* EXECUTE THE QUERY
    const tours = await query;

    //* SEND RESPONSE
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
