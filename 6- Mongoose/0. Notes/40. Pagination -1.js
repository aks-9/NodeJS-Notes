//* Pagination -1

//This is 'tourController.js' file

//? Allowing the user to only select a certain page of our results, in case we have a lot of results. We will use the 'page' and 'delimit' fields.

//So let's pretend that we have a 1000 documents in a certain collection, and we say that on each page we have 100 documents. So that would mean that we'd have 10 pages.

//Let's say we want page=2 and there will be a limit field. And this limit here basically means the amount of results that we want per page. And that's actually set here only to 10.

// 127.0.0.1:3000/api/v1/tours?page=2&limit=10

// Now going back to the example of 1000 results, if the limit is 10, so only 10 results per page, well then we're gonna have 100 pages and in here we are then displaying page number 2 of these 100 pages. Now we'll implement this in our code using Mongoose.

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
    //Query is for page=2&limit=10
    query = query.skip(10).limit(10); // 'limit' is the amount of results that we want in the query and 'skip' is the amount of results that should be skipped before actually querying data.

    //so let's say that the user wants page number two with 10 results per page. That means that results one to 10 are on page one, and 11 to 20 are on page 2. Okay, and so what that means is that we want to skip 10 results before we actually start querying.

    // page 1: 1-10
    // page 2: 11-20
    // page 3: 21-30

    // so we need to skip 10 results in order to get to result number 11 on page 2. If we were to request page 3, then first 20 results would be required to be skipped.

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
