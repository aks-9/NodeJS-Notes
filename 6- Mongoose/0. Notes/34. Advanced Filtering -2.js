//* Advanced Filtering -2

//This is 'tourController.js' file

//? Replacing the Query Object with Query string

const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    //* BUILD THE QUERY
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((element) => delete queryObj[element]);

    // 2) Advanced Filtering
    // Filter Object ==> { difficulty: 'easy' , duration: { $gte: 5 } }
    // Query Object  ==> { difficulty: 'easy' , duration: { gte: '5' }}

    let queryStr = JSON.stringify(queryObj); // First we're gonna convert the object to a string
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // Using replace function on that query string.
    // The first argument is a regular expression, with '\b' before and after the regular expression, and that's because we only want to match these exact four words. The '/g 'flag here means that it will actually happen multiple times. So if we have like two or three operators or even all of them, then it will replace all of them.

    // And so what we want to do here is to basically match one of these four words and then replace it with the same words but with the dollar sign in front.

    // The second argument is a callback function, and it has as the first argument 'match', which is the matched word, or the matched string. And the what we return from this callback is the new string that will replace the old one. We will use a template string here, and so we want to replace the 'match' with '$match'
    console.log(JSON.parse(queryStr));

    const query = Tour.find(queryObj);

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
Go to Postman, and send a request with this query string:

127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[gte]=5

We will get this error in Postman output and that's of course because MongoDB cannot really use the query string or the query object as we have it right now.

But back in terminal:

Query Object ==> { difficulty: 'easy', duration: { gte: '5' } }   
Query String ==> { difficulty: 'easy', duration: { '$gte': '5' } } 

So now we have the dollar sign in front of the operator.

*/
