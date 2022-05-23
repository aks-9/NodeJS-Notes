//* Importing data to database from .json file- 1

//This is 'dev-data/data/import-dev-data.js' file

const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful!"));

// READ JSON FILE
const tours = JSON.parse(
  //convert JSON into a JavaScript object using 'json.parse'
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
); // Now we will have an array of JavaScript objects in 'tours' that we can now pass into the 'create' method.

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours); //the 'create' method can also accept an array of objects. And in that case it will then simply create a new document for each of the objects in the array.
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany(); // We could use 'deleteMany' and then simply pass in nothing in there and that would then delete all of the documents in a certain collection. The 'Tour' model has access to this 'deleteMany' method which will then do exactly the same as 'deleteMany' does in native MongoDB.
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
};

console.log(process.argv);

/*

node dev-data\data\import-dev-data.js

OUTPUT:
[
  'C:\\Program Files\\nodejs\\node.exe',
  'D:\\Work\\NodeJS\\6- Mongoose\\starter\\dev-data\\data\\import-dev-data.js'
]

==> So 'process.argv' and basically that is an array of these two arguments of running this node process. So, this here is basically where the node command is located.


So now if we run: node dev-data\data\import-dev-data.js --import

OUTPUT: 
[
  'C:\\Program Files\\nodejs\\node.exe',
  'D:\\Work\\NodeJS\\6- Mongoose\\starter\\dev-data\\data\\import-dev-data.js',
  '--import'
]


==> And so you see that now the third argument is '--import'. And so this means that we can now go ahead and basically use this data here in '--import' in order to write a very simple command line application basically which will import the data when we specify this option and will delete the data when we specify the delete option.

We will do exactly that in the next part.
*/
