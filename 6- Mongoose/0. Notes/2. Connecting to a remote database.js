//* Connecting to a remote database

// This is 'server.js' file.

// First install the mongoose driver: npm i mongoose@5.5.2

const mongoose = require("mongoose"); //importing
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

//replacing the '<PASSWORD>' string with the real database password
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//connecting to the DB and passing an object as a second parameter, which will have some options to deal with deprecation warnings. These options are already set to these values in Mongoose version 6 onwards, so we don't need to use them in newer versions. This 'connect' method is going to return a promise, so we'll use 'then' method on it.
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log(con.connections);
    console.log("DB connection successful!");
  }); //This promise gets an access to a connection object, let's call it 'con' and it will be the resolved value of the promise. Logging a 'connections' property on 'con' object.

//* START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

//Since our script in 'package.json' file "start:dev": "nodemon server.js",  is not just called 'start', which is kind of a standard, we always have to type 'npm run start:dev' instead of writing just 'npm start', without the 'run'. And so, lets change the name here back to "start": "nodemon server.js"

//now write 'npm start' in the terminal. And it should print the 'connction object' as well as 'DB connection successful!'
