//* POST response.

//This is 'app.js file.'

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Hello from the server side!", app: "Natours" });
});

//For a POST request.
app.post("/", (req, res) => {
  res.send("You can POST to this endpoint...");
});

const port = 3000;

app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/* 
 Go to the Postman app, and paste 127.0.0.1:3000/ in its address bar. Make sure to keep the type of request as 'POST' and click 'send'.
 
OUTPUT:
{
  You can POST to this endpoint...
}

*/
