//* Environment variables-4

// This is 'server.js' file.

//So we need some way of reading these variables from 'config.env' file and then saving them as environment variables. And for that the standard is kind of using a npm package called 'dotenv'.

// npm i dotenv

// Now in 'server.js' file require 'dotenv' module.

const app = require("./app");
const dotenv = require("dotenv"); //importing

dotenv.config({ path: "./config.env" }); //reading the environment variables from 'config.env' file.

// console.log(app.get('env'));

console.log(process.env);

//* START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/*
Now run npm start

and it will print our environment variables mentioned in the 'config.env' file, along with all the others in the console. We will have to search a little in the printed list.

PORT: '8000',
USER: 'ashish',
NODE_ENV: 'development',
PASSWORD: '123456',
*/
