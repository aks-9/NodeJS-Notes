//* Filtering -7

//This is 'tourController.js' file

//? How queries work in Mongoose-1

const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((element) => delete queryObj[element]);

    const tours = await Tour.find(queryObj); //This 'find' method here is going to return a query. Actually, all of this 'Tour.find(queryObj)' will return a query. And that is the reason why we can then chain other methods.

    /* 
    Again, if you go to the documentation,
    
    https://mongoosejs.com/docs/api.html#Query
    
    when we use the find method, it will return an object which is a query. So in 'Query.prototype', we then have all of these methods.

    For example, we have 'Query.prototype.where()', 'Query.prototype.sort()' etc. All of these are part of 'Query.prototype'. Which, again, refers to objects that we're creating using the 'Query' class.

   */

    /*
  
  ==> Now comes the important part. As soon as we actually 'await' the result of the query, so as soon as we use 'await' here: 
    
    const tours = await Tour.find(queryObj);
    
    the query will then execute and come back with the documents that actually match our query. If we do it like this, then there is no way of later implementing sorting, or pagination, or all of these other features. 

    Instead, what we will have to do, is to save this part here into 
    const query = await Tour.find(queryObj);

    then in the end, as soon as we change all the methods to the 'query' constant that we need to, only then by the end, we can await that 'query'.

    For example, we're going to use the 'sort', 'predict', 'limit' method, and a bunch of methods, and chain them to this query. That would be impossible to do, if we await the result of this initial query here.

    We will implement it in the next part.

   */

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
