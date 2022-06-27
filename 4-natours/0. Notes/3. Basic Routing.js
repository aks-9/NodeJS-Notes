//* Basic Routing.

//This is 'app.js file.'

const express = require("express");
const app = express();

//Routing
//Using the 'get' method to describe the type of request on app. The first argument is the 'path', and second is the callback function where we will have 'res' and 'req' as arguments.
app.get("/", (req, res) => {
  res.status(200).send("Hello from the server side!"); //sending a response string from the server along with the status code. 200 means OK.
});

const port = 3000;

app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/* 
Install nodemon by running: npm i nodemon

Now add it to the package.json: 

"scripts": {
  "start": "nodemon app.js"
}

To start the nodemon Run: 
npm start

Then to test the API we have created, go to the Postman app, and paste 127.0.0.1:3000/ in its address bar. Make sure to keep the type of request as 'GET' and click 'send'.

You should then see the following response from the server:

Hello from the server side!

*/
