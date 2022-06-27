//* Document Middleware- 3

// This is 'tourModel.js' file.

//? Post document middleware

const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
    },
    slug: String,
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

//* DOCUMENT MIDDLEWARES:

//pre document middleware
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//we can have, of course, multiple pre middlewares or also post middlewares for the same hook. And hook is what we call this 'save' here. So this middleware here is basically what we call a 'pre save' hook.

//pre document middleware
tourSchema.pre("save", function (next) {
  console.log("Will save document...");
  next();
});

//post document middleware
tourSchema.post("save", function (doc, next) {
  //post middleware has access not only to next, but also to the document that was just saved to the database. They are executed after all the pre middleware functions have completed
  console.log(doc); //here we actually no longer have the 'this' keyword, but instead we have the basically finished document here in doc.
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

/*
Create a new tour 
127.0.0.1:3000/api/v1/tours

{
    "name": "Test Tour 9",
    "duration": 10,
    "difficulty": "easy",
    "maxGroupSize": 1,
    "price": 100,
    "rating": 4.7,
    "summary": "test tour",
    "imageCover" : "tour-3-cover.jpg"
}


Output:

Will save document...

{
slug: 'test-tour-9',
}


==> indeed. So our slug is here, right, and so let's take a look at our console, and so indeed, our second pre middleware also run, so the one logging 'will save document' and then, our post middleware logged to the console the final document.


==> we can have middleware running before and after a certain event. And in the case of document middleware, that event is usually the 'save' event. And then in the middleware function itself, we have access to the 'this' keyword, which is gonna point at the currently being saved document. And it's also very important to keep in mind that this 'save' middleware only runs for the 'save' and 'create' Mongoose methods. It's not gonna run, for example, for 'insert many' and also not for 'find one' and 'update' or 'findbyIDandupdate' 
*/
