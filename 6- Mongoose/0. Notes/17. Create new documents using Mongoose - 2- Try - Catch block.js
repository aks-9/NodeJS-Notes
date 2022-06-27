//* Create new documents using Mongoose - 2

//This is 'tourController.js' file

//? Adding try and catch block for error handling.

const Tour = require("./../models/tourModel");

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
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

Go to the Postman, click on "Create New Tour" with following data:
{
    "name": "Test Tour 4",
    "duration": 10,
    "difficulty": "easy",
    "price": 100,
    "rating": 4.7
}

This should be the output:


Output: 
{
    "status": "success",
    "data": {
        "tour": {
            "rating": 4.7,
            "_id": "628a42d3c14f7333d8a072ca",
            "name": "Test Tour 4",
            "price": 100,
            "__v": 0
        }
    }
}


==> Notice that we have no 'difficulty' in the output. That's because it is actually not in our schema that is in the  'tourModel.js' file and so therefore they are not put in the database. So everything else that is not in our schema is simply ignored.



==> Now if we try to send the same request again, it should give us an 'duplicate' error:

{
    "status": "fail",
    "message": {
        "driver": true,
        "name": "MongoError",
        "index": 0,
        "code": 11000,
        "keyPattern": {
            "name": 1
        },
        "keyValue": {
            "name": "Test Tour 4"
        },
        "errmsg": "E11000 duplicate key error collection: natours.tours index: name_1 dup key: { name: \"Test Tour 4\" }"
    }
}

*/
