//* Catching Errors in Async Functions- 3

//This is 'tourController.js' file

//* Removing all try and catch blocks from other functions.

const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

//wrapping the entire function in catchAsync(), and removing 'try' and 'catch' blocks
exports.getAllTours = catchAsync(async (req, res, next) => {
  //adding next
  //* EXECUTE THE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  //* SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

//wrapping the entire function in catchAsync(), and removing 'try' and 'catch' blocks
exports.getTour = catchAsync(async (req, res, next) => {
  //adding next
  const tour = await Tour.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

//wrapping the entire function in catchAsync(), and removing 'try' and 'catch' blocks
exports.updateTour = catchAsync(async (req, res, next) => {
  //adding next
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
});

//wrapping the entire function in catchAsync(), and removing 'try' and 'catch' blocks
exports.deleteTour = catchAsync(async (req, res, next) => {
  //adding next
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

//wrapping the entire function in catchAsync(), and removing 'try' and 'catch' blocks
exports.getTourStats = catchAsync(async (req, res, next) => {
  //adding next
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } } // '$ne' is not equal
    // } //repeating stages
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

//wrapping the entire function in catchAsync(), and removing 'try' and 'catch' blocks
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  //adding next
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});

/*



*/
