//* A better file structure-7

//This is 'server.js' file.

const app = require("./app"); //importing app, so that we could use the 'listen' method on it.

//* START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

//later on we will actually have other stuff in this file that is not related to express, but still related to our application. So stuff like database configurations, or some error handling stuff, or environment variables, all of that stuff will live in this 'server.js', which is kind of our entry point.

/*
Go to package.json, and create an npm script to run nodemon on server.js

Run npm start, 

Open the Postman app, and click on 'Get All Tours', it should work.

*/
