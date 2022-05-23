//* Filtering -5

//This is 'tourController.js' file

//* Excluding special field name from query-2

const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    //create a shallow copy of the 'req.query' object.
    const queryObj = { ...req.query }; //Destructuring, as we need a hard copy of the 'req.query' object and not a reference. And then we can simply create a new object out of that.So we have a new object that is basically going to contain all the key value pairs that were in our 'req.query' object.

    //Now create an array of all the fields that we want to exclude.
    const excludedFields = ["page", "sort", "limit", "fields"];

    //Next, what we need to do is to basically remove all of these fields from our query object. And in order to do that, we will loop over these fields. And we're using 'forEach' because we don't want to save a new array. Then for each of these of elements, we can use the 'delete' operator. And then from the 'queryObj', we want to delete the field with the name of element, i.e. the current element in the array. So we will first delete the field of 'page', then the 'sort', then the 'limit', then the 'fields'. Of course, only in case if its there.
    excludedFields.forEach((element) => delete queryObj[element]);

    console.log(req.query, queryObj); //logging 'queryObj'

    const tours = await Tour.find(req.query);

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
Now go to Postman, and make a new request of "Get All Tours",

127.0.0.1:3000/api/v1/tours?difficulty=easy&page=2&sort=1&limit=10

In the terminal, we will see the original query: 
{ difficulty: 'easy', page: '2', sort: '1', limit: '10' }

and after deleting the fields mentioned in our 'excludedFields', the 'queryObj' is: 
{ difficulty: 'easy' }

*/
