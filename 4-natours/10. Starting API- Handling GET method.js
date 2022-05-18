//* Starting API- Handling GET method

//This is 'app.js file.'

const fs = require("fs"); //importing 'fs' module.
const express = require("express");
const app = express();

//Reading data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
); //reading and parsing JSON data from a file, converting it to an array of JS objects.

//Route Handler
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success", //'JSend' JSON formatting standard
    results: tours.length, //Not standard, but to inform client about the data it is receiving.
    data: {
      tours: tours,
    }, //So we specify the 'data' property and it will in turn have an object which then contains the actual data, i.e the response we actually wanna send.
  });
});

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can POST to this endpoint...');
// });

const port = 3000;

app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/* 
 
OUTPUT:

Go to Postman app, use GET method and paste 127.0.0.1:3000/api/v1/tours in the address bar. Click send.

You would see the data from tours-simple.json file now.

*/
