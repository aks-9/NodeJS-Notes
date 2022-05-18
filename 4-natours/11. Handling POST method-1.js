//* Handling POST method-1

//This is 'app.js file.'

const fs = require("fs");
const express = require("express");
const app = express();

//with a post request, data is sent from the client to the server. This data should be then ideally available on the request object. But Express does not put that body data on the request, and in order to have that data available, we have to use something called 'middleware'.

app.use(express.json()); //middleware  is basically a function that can modify the incoming request data. It's called middleware because it stands in between the request and the response. It's just a step that the request goes through while it's being processed. And ins this step, the data from the body is added to the request object by using this middleware.

//Reading data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//Route Handler for GET
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

//Route Handler for POST
app.post("/api/v1/tours", (req, res) => {
  console.log(req.body); //body is the property that is gonna be available on the request, because we used that middleware
  res.send("Done"); //sending back a response. We always need to send back something in order to finish the so-called request/response cycle.
});
const port = 3000;

app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/* 
 
OUTPUT:

Go to Postman app, use POST method and paste 127.0.0.1:3000/api/v1/tours in the address bar. Save it in a new collection called, 'Natours' as 'Create New Tours'. Similarly save the GET request as 'Get All Tours'. 

Postman app is acting as a client here that is going to send some data using POST.

Then in Postman app, specify 'body' , i.e. the data that we want to send to the server. We go to 'Body' , and select, 'raw' radio-button, and then under the dropdown arrow labelled as 'Text', select 'JSON'.

So the first thing we want to specify is the name of the Tour, and in JSON, everything has to be in double quotes like this:

{
    "name": "Test Tour",
    "duration": 10,
    "difficulty": "easy"
}

Now make sure that  'Create New Tours' is selected under 'Natours' and Click send. Make sure to run nodemon before this.

You would get the following output in Postman:
'Done'  /// This is the the response we have sent in our POST handler.

And now back in the terminal where nodemon is running, you shold see the following output print:

{ name: 'Test Tour', duration: 10, difficulty: 'easy' }

So in our console, we now have a JSON object that we sent in our body through Postman. But Now, it is no longer JSON object, it is now a JavaScript object.


So in the next part, we want to actually persist this data into our "tour-simple.JSON" file, that means to save this data in a file. We're actually gonna modify this file, which is our fictional database here, so that the data received from server is saved to it. 
*/
