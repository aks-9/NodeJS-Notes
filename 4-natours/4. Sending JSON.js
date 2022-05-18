//* Sending JSON.

//This is 'app.js file.'

const express = require("express");
const app = express();

//Routing
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello from the server side!", app: "Natours" }); //To send a JSON object, we use 'json' method.
});

const port = 3000;

app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/* 
 Go to the Postman app, and paste 127.0.0.1:3000/ in its  address bar. Make sure to keep the type of request as 'GET' and click 'send'.
 
OUTPUT:
{
    "message": "Hello from the server side!",
    "app": "Natours"
}

*/
