//* Deleting Documents using Mongoose.

//This is 'tourController.js' file

//? Deleting a specific document with mongoose.

const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
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
    await Tour.findByIdAndDelete(req.params.id); //Only requires an 'id' in 'findByIdAndDelete' method.
    res.status(204).json({
      //status code 204-No content
      status: "success",
      data: null, //sending null
    });
  } catch (err) {
    res.status(400).json({
      status: "success", // success of deletion.
      message: err,
    });
  }
};

/* 
==> Go to the Postman, and create a new tour 'Jonas Tour'

{
    "name": "Jonas Tour",    
    "price": 697,
    "rating": 4.8
}

OUTPUT: 
{
    "status": "success",
    "data": {
        "tour": {
            "rating": 4.8,
            "_id": "628a5f882f4a8b29cc3cc4b3",
            "name": "Jonas Tour",
            "price": 697,
            "__v": 0
        }
    }
}

Now this will showup in the 'Get All Tours'.

Then goto the 'Delete Tour' and pass the ID of the 'tour' we just created.

127.0.0.1:3000/api/v1/tours/628a5f882f4a8b29cc3cc4b3

Now when you again click 'Get All Tours', the "Jonas Tour" should not be there.


*/
