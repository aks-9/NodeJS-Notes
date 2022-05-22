//* Updating Documents using Mongoose.

//This is 'tourController.js' file

//* updating a specific document with mongoose.

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
      // using 'findByIdAndUpdate' method to update a document, which is a query method similar to 'findById' used for reading a document. First argument is the 'id', then second is the data that we actually want to change and that data will be in the body of the request, lastly the third argument will be some options.
      new: true, //And the first option to specify is 'new' and set it to 'true'. Because this way, then the new updated document is the one that will be returned. And since we want to send back that updated document to the client, we always want this method to actually return that new document. So all of these methods that we've been using on the To'ur so far, all of these will return queries, so they are query methods.
      runValidators: true, //each time that we update a certain document, then the validators that we specified in the schema will run again.
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

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};

/* 
More query methods: https://mongoosejs.com/docs/queries.html

model.prototype.save()

In java script 'model.prototype' always means an object created from a 'class', or in this case, created from a 'model'. And so, the 'save' method here, refers to a 'save' method called on a 'document' and not on a 'Tour'.

So when you see 'model.prototype' here, you know that the 'save' method here is going to be available on all of the instances created through a 'model'. And so, not on the model itself.

For example, if you tried tour.save you wouldn't be able to use it. It would give you an error, but instead, if you tried save on a document created through the tour, then it would work.



==> Go to the Postman, click on "Update A Tour" and add the id as '628795f237510936ec4c7a56' from the document 'The Park Camper' taken from 'Get All Tours'. 

127.0.0.1:3000/api/v1/tours/628795f237510936ec4c7a56

And now update the price:
{
    "price": 500
}



This should be the output: 

{
    "status": "success",
    "data": {
        "tour": {
            "rating": 4.5,
            "_id": "628795f237510936ec4c7a56",
            "name": "The Park Camper",
            "price": 500,
            "__v": 0
        }
    }
}


==> If we pass a string instead of a number in the 'price' field, it will give us an error, as the 'runValidators' has been set to true. So the 'validators' in our schema will run again.

{
    "price": "Some price"
}

OUTPUT:
{
    "status": "fail",
    "message": {
        "message": "Cast to number failed for value \"Some price\" at path \"price\"",
        "name": "CastError",
        "stringValue": "\"Some price\"",
        "kind": "number",
        "value": "Some price",
        "path": "price"
    }
}

*/
