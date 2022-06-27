//* Importing data to database from .json file- 2

// This is 'dev-data/data/import-dev-data.js' file

//? Making a smal cli application to import and delete the data.

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
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit(); //this 'process.exit' is kind of an aggressive way of stopping an application but in this case it's no problem because it's really just a very small script that we're running here and not a real application
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

/*
So now if we run: node dev-data\data\import-dev-data.js --import

OUTPUT: 
[
  'C:\\Program Files\\nodejs\\node.exe',
  'D:\\Work\\NodeJS\\6- Mongoose\\starter\\dev-data\\data\\import-dev-data.js',
  '--import'
]

==> And so you see that now the third argument is '--import'. And so this means that we can now go ahead and basically use this data here in '--import' in order to write a very simple command line application basically which will import the data when we specify this option and will delete the data when we specify the delete option.


*/

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

/*
Now run: node dev-data\data\import-dev-data.js --delete

OUTPUT:

DB connection successful!
Data successfully deleted!


==> Now if you go to Postman and try running 'Get All Tours', it will give zero results.

{
    "status": "success",
    "results": 0,
    "data": {
        "tours": []
    }
}


*/
