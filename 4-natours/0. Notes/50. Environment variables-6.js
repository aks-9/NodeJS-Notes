//* Environment variables-6

// This is 'server.js' file.

//* setting port from 'config.env' file.

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app"); //We must require the 'app' after require of 'dotenv'
// console.log(app.get('env'));

// console.log(process.env);

//* START SERVER
const port = process.env.PORT || 3000; //setting port from 'config.env' file.
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/*

Go to Postman, click on 'Get All Tours'

and it should print the following:

development
App running on 3000...
Hello from the middleware 👋
2022-05-18T10:21:47.788Z
GET /api/v1/tours 200 7.784 ms - 8746

*/
