//* Refactoring API Features- 1

// This is 'tourController.js' file.

//? Creating a separate class 'APIFeatures' and adding separate methods for our API's features.

const Tour = require("./../models/tourModel");

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

//create a class in which we're going to add one method for each of these API features
class APIFeatures {
  constructor(query, queryString) {
    // We're passing the query here because we do not want to query inside of this class because that would then bounce this class to the tour resource
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1A) Filtering
    const queryObj = { ...this.queryString }; //'req.query' is not going to be available inside of this class. And so, that's why we actually parsed in the 'queryString'. And so, this here is going to get replaced with 'this.queryString'.

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((element) => delete queryObj[element]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr)); //We do not want to query the 'Tour' directly here,but instead, I simply want to now add this find to the query that we already have.
    this.query.find(JSON.parse(queryStr));
  }
}

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //* BUILD THE QUERY
    // 1A) Filtering
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(element => delete queryObj[element]);

    // 1B) Advanced Filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr));

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
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("This page doesn't exist.");
    }

    //* EXECUTE THE QUERY
    //Using the class APIFeatures, create a new API features object, so, basically, creating an instance of this class API features that will then get stored into 'features'. We'll, then, have access to all the methods on 'features' that we're going to define in the class definition.
    const features = new APIFeatures(Tour.find(), req.query).filter(); // in here, we need to pass a query and the queryString. So 'Tour.find' is our query,  and queryString is 'req.query'. On 'features' here, remember, we have no access to 'filter'. And so, let's actually put it right here afterwards.

    // const tours = await query; // this 'query' here does not anymore exist. Instead, what we have now is 'features.query'
    const tours = await features.query;

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
