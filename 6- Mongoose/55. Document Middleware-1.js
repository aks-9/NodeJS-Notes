//* Document Middleware-1

// This is 'tourModel.js' file.

//* just like with Express, we can use Mongoose middleware to make something happen between two events.

//For example, each time a new document is saved to the database, we can run a function between the save command is issued and the actual saving of the document, or also after the actual saving. And that's the reason why Mongoose middleware is also called pre and post hooks.

//there are four types of middleware in Mongoose: document, query, aggregate, and model middleware. And in this lecture, we're gonna talk about document middleware, which is middleware that can act on the currently processed document.

const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a dificulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      required: [true, "A tour must have a summary"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a imageCover"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//we define a middleware on the schema, so 'tourSchema.pre'. And so this is for pre middleware, which is gonna run before an actual event. And that event in this case is the save event. And so this call back function that we're gonna define here next, will be called before an actual document is saved to the database. So it runs before the save command and the .create command. But not on insert many. So if we use insertMany, then that will actually not trigger the save middleware.

//* DOCUMENT MIDDLEWARE: runs before .save() and .create() but not on insertMany
tourSchema.pre("save", function () {
  //in a save middleware, the 'this' keyword here is gonna point to the currently processed document.
  console.log(this);
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

/*
Create a new tour 
127.0.0.1:3000/api/v1/tours

{
    "name": "Test Tour 6",
    "duration": 10,
    "difficulty": "easy",
    "maxGroupSize": 1,
    "price": 100,
    "rating": 4.7,
    "summary": "test tour",
    "imageCover" : "tour-3-cover.jpg"
}


Output in terminal:

{
  ratingsAverage: 4.5,
  ratingsQuantity: 0,
  images: [],
  createdAt: 2022-05-25T16:27:07.110Z,
  startDates: [],
  _id: 628e58e0cf871b21dc4d5995,
  name: 'Test Tour 6',
  duration: 10,
  difficulty: 'easy',
  maxGroupSize: 1,
  price: 100,
  summary: 'test tour',
  imageCover: 'tour-3-cover.jpg',
  durationWeeks: 1.4285714285714286,
  id: '628e58e0cf871b21dc4d5995'
}
POST /api/v1/tours 201 103.932 ms - 392

==> so this is what our document is looking like right before it saved into the database. and you can even see the virtual property that we defined here. And so at this point of time, we can still act on the data before it is then saved to the database and that is exactly what we're gonna do now.
*/
