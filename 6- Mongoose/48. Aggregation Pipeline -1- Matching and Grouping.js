//* Aggregation Pipeline -1

// This is 'tourController.js' file.

//* Matching and Grouping

// MongoDB aggregation pipeline is an extremely powerful and extremely useful MongoDB framework for data aggregation. We define a pipeline that all documents from a certain collection go through where they are processed step by step in order to transform them into aggregated results.

//For example, we can use the aggregation pipeline in order to calculate averages or calculating minimum and maximum values or we can calculate distances even, and we can really do all kinds of stuff.

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

//Aggregation Pipeline to calculate a couple of statistics about our tours.
exports.getTourStats = async (req, res) => {
  try {
    //the aggregation pipeline is a bit like a regular query and so using the aggregation pipeline it's a just a bit like doing a regular query. The difference here is that in aggregations we can manipulate the data in a couple of different steps.

    //And for that, we pass in an 'array' of so-called 'stages'. And again the documents then pass through these 'stages' one by one, step by step in the define sequence as we define it here.

    // .find is gonna return a query, and .aggregate is gonna return an aggregate object. And then only when we await it, it actually comes back with the result.
    const stats = await Tour.aggregate([
      //each of the elements in this array will be one of the stages and each of the stages is an object. and we will use query operators in them. We will now use aggregation pipeline stages, 'match' and 'group' etc.
      {
        $match: { ratingsAverage: { $gte: 4.5 } }, //match is basically to select or to filter certain documents. It's really just like a filter object in MongoDB. Here we're selecting documents which have a ratings average greater or equal than 4.5.
      },
      {
        //next one is now the group stage. It allows us to group documents together, basically using accumulators. And an accumulator, is for example, even calculating an average. So if we have five tours, each of them has a rating, we can then calculate the average rating using group.
        $group: {
          _id: null, //always need to specify a field 'id' because this is where we're gonna specify what we want to group by.For now, we say null here because we want to have everything in one group so that we can calculate the statistics for all of the tours together and not separate it by groups.
          // _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 }, //we basically add 1 for each document, and for each of the document that's gonna go through this pipeline, 1 will be added to this 'numTours' counter.
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" }, //$avg is another MongoDB operator , and in order to specify the field which we want to calculate the average from, we need to use the dollar sign, but in quotes here and then the name of the field.
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
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
And now all we need to do is actually add a new route in our 'tourRoutes.js' file:

router.route('/tour-stats').get(tourController.getTourStats);

Now in Postman:
127.0.0.1:3000/api/v1/tours/tour-stats

OutPut:

{
    "status": "success",
    "data": {
        "stats": [
            {
                "_id": null,
                "numTours": 9,
                "numRatings": 270,
                "avgRating": 4.722222222222222,
                "avgPrice": 1563.6666666666667,
                "minPrice": 397,
                "maxPrice": 2997
            }
        ]
    }
}
*/
