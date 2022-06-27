//* Start the server.

//This is 'app.js file.'

const express = require("express"); // importing module for express.

const app = express(); //This here is a function which upon calling will add a bunch of methods to our app variable here.

const port = 3000; //defining the port number on which the app will run.

//To start up a server we'll use 'listen' method on 'app'. The first argument is 'port' and then it will also have a callback function as the second argument that will be called as soon as the server starts listening.
app.listen(port, () => {
  console.log(`App running on ${port}...`); //logging
});
