//* Pagination -2

//This is 'tourController.js' file

//? Getting page and skip values from the query string.

const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //* BUILD THE QUERY
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((element) => delete queryObj[element]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // 3) Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // 4) Pagination
    // Before we can actually get started calculating the 'skip' value, we need to first get the 'page' and the 'limit' from the 'query' string and we should also define some default values. Because we still want to have pagination even if the user does not specify any page or any limit, as loading all the pages could be problematic for larger documents. So, we will define by default page 1 and a limit of let's say 100.

    const page = req.query.page * 1 || 1; // We multiply it by 1 which converts a string to a number. As each time that we actually put a number in a query string, it will then become a string  and so we need to fix that simply by multiplying by 1. So by default, we want page number 1. This is a nice way in JavaScript of basically defining default values.

    const limit = req.query.limit * 1 || 100; //limit =100
    const skip =
      (page - 1) *
      limit; /* let's say we are requesting page=3 , with the limit=10.
    
    page 1: 1-10
    page 2: 11-20
    page 3: 21-30
    
    And we see that for page 3, the results are from 21 to 30. So it starts at result number 21, meaning that we need to skip 20 results. And 20 results is basically 2 * 10, so two times the limit. 
    
    Okay, and from there we actually start getting a formula. So 2 * 10 is basically (3-1) * 10. And 3 is the page that we're on. So that is our formula: (page - 1) * limit. 
    
    */

    //Query is for page=2&limit=10
    query = query.skip(skip).limit(limit); //passing 'skip' and 'limit' variables in skip() and limit() methods.

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

/*
 So send 127.0.0.1:3000/api/v1/tours?page=1&limit=3

 We will on get 3 results, on page 1.
*/
