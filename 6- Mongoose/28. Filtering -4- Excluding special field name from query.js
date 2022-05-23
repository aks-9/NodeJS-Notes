//* Filtering -4

//This is 'tourController.js' file

//* Excluding special field name from query-1

const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    const tours = await Tour.find(req.query); //we actually already have an object that looks a lot like { duration: '5', difficulty: 'easy' }. And that is 'req.query'. If you compare it, to this object { duration: '5', difficulty: 'easy' }, looks exactly the same as earlier method. To implement a very simple filter, all we have to do in this case is to say, req dot query.

    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    //Now, the problem with this implementation, is that its actually way too simple. That's because, later on, we will have other query parameters. For example, sort, for sorting functionality, or page, for pagination. We need to make sure that we are not querying for these in our database. For example, if we added here, page=2, then we would not get any result because there is no document in this collection where page=2. We only want to use this parameter 'page', to implement pagination and not to actually 'query' in the database. So what we will have to do is, to basically exclude these special field names from our query string before we actually do the filtering.

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

*/
