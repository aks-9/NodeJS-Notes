//* Field Limiting- 1

//This is 'tourController.js' file

//? To allow clients to choose which fields they want to get back in the response. It's a very nice feature to allow the API user to only request some of the fields.

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
      query = query.select(fields); // This operation of selecting only certain field names is called projecting.
    } else {
      query = query.select("-__v"); //default. This will be removed always from request. We always have this '__v', which is set to zero, and MongoDB just creates these fields because it uses them internally. So what we can do is to basically never send them to the client. We just prefix it with a minus. So minus is then not including, but excluding.
    }

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
Go to Postman, 'Get All Tours'

 127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price

The response will be without '-v'

If you put minus in front of name and duaration, they won't be in response.

127.0.0.1:3000/api/v1/tours?fields=-name,-duration
*/
