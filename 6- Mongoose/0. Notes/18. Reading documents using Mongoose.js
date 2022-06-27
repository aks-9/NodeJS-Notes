//* Reading documents using Mongoose

//This is 'tourController.js' file

//? Implement 'getTours' and 'getAllTours' route handlers.

const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    // adding try block

    const tours = await Tour.find(); //reading documents. This 'find' method here will return an array of all these documents, and will also very nicely convert them into JavaScript objects.

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        //sending tours after enveloping.
        tours,
      },
    });
  } catch (err) {
    //adding catch block
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // adding try block
    const tour = await Tour.findById(req.params.id); //'id' is used because that's what we used in our router. 'findById()' is a helper function for: 'Tour.findOne({ _id: req.params.id })'. Here it is '_id' because that is used in MondoDB.

    res.status(200).json({
      status: "success",
      data: {
        //sending tours after enveloping.
        tour,
      },
    });
  } catch (err) {
    //adding catch block
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  //adding the 'try' block.
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    //adding the 'catch' block
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tours: "<Updated tour here...>",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};

/* 

Go to the Postman, click on "Get A Tour" and add the id as '628795f237510936ec4c7a56' from the document 'The Park Camper' taken from 'Get All Tours'.

127.0.0.1:3000/api/v1/tours/628795f237510936ec4c7a56

This should be the output: 

{
    "status": "success",
    "data": {
        "tour": {
            "rating": 4.5,
            "_id": "628795f237510936ec4c7a56",
            "name": "The Park Camper",
            "price": 997,
            "__v": 0
        }
    }
}

*/
