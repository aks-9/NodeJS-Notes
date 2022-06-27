//* Virtual Properties

//This is 'tourModel.js' file.

//? Fields that we can define on our schema but that will not be persisted. So they will not be saved into the database in order to save us some space there.

//And most of the time, we want to really save our data to the database, but virtual properties make a lot of sense for fields that can be derived from one another. For example a conversion from miles to kilometers, it doesn't make sense to store these two fields in a database if we can easily convert one to the other.

//let's now define a virtual property that contains the tour duration in weeks. And so that's a field basically that we can very easily convert from the duration that we already have in days.

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
  // Second Argument. As we need to explicitly define in our schema that we want the virtual properties in our output. Into this Mongoose.schema, we can pass in not only the object with the schema definition itself, but also an object for the schema options.
  {
    toJSON: { virtuals: true }, //When data is actually outputted as JSON
    toObject: { virtuals: true }, // When data is actually outputted as an Object
  }
);

// We define that virtual properties on the 'tourSchema', so tourSchema.virtual and then the name of the virtual property 'durationWeeks'.
tourSchema.virtual("durationWeeks").get(function () {
  //we need to define the get method. And that's because this virtual property will basically be created each time that we get some data out of the database. And so this get function here is called a getter.

  //Now in here we pass a function, and actually this call back function is gonna be a real function, so not an arrow function. Because remember, an arrow function does not get its own 'this' keyword. In here we actually need the 'this' keyword because the 'this' keyword in this case is going to be pointing to the current document. And so usually when we want to use 'this', then we should always use a regular function. So really everywhere in Mongoose, I'm gonna always be using these regular functions that we're used to.

  //To define the virtual property all we have to say is that we want to return 'this.duration', in this case, divided by seven.
  return this.duration / 7;
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;

/*
Now go to 127.0.0.1:3000/api/v1/tours

we should then be able to see duration weeks. So it's five days, and so that is 0.71 weeks.


==> Now one thing that we need to keep in mind is that we cannot use this virtual property here in a query, because they're technically not part of the database. So we can not say, for example, 'tour.find' where duration weeks is equal to one. That's not gonna work, again because this property is not actually part of the database.
*/
