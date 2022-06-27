//* Aggregation Pipeline -2

// This is 'tourController.js' file.

//? group our results for different fields.

const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" }, //group our results for different fields. And let's actually start out with the difficulty. Now we will group our data according to different difficulties. '$toUpper' makes the output in all caps.
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 }, //And now here in the sorting we actually need to use the field names that we specified up here in the group. We can no longer use the old names because at this point they are already gone. They no longer exist. So at this point, in the aggregation pipeline, we really already have these results. So these are now our documents basically. So if you want to sort by the average price, then this is the field name we gotta use.
        // 1 for ascending
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } } // '$ne' is not equal
      // } //repeating stages
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats, //data name
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

/*
127.0.0.1:3000/api/v1/tours/tour-stats

{
    "status": "success",
    "data": {
        "stats": [
            {
                "_id": "EASY",
                "numTours": 4,
                "numRatings": 159,
                "avgRating": 4.675,
                "avgPrice": 1272,
                "minPrice": 397,
                "maxPrice": 1997
            },
            {
                "_id": "MEDIUM",
                "numTours": 3,
                "numRatings": 70,
                "avgRating": 4.8,
                "avgPrice": 1663.6666666666667,
                "minPrice": 497,
                "maxPrice": 2997
            },
            {
                "_id": "DIFFICULT",
                "numTours": 2,
                "numRatings": 41,
                "avgRating": 4.7,
                "avgPrice": 1997,
                "minPrice": 997,
                "maxPrice": 2997
            }
        ]
    }
}
*/
