//* Environment variables-7

// This is 'server.js' file.

//* add a new start script to our package.json

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

//* START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

/*

So right now, in the 'package.json' file we have 'start: nodemon server.js', but I also want to add another one for production just so that we can test what happens in that situation.



"scripts": {
    "start:dev": "nodemon server.js",
    "start:prod": "SET NODE_ENV=production&& nodemon server.js"
  },
  
  So in production we simply want to set the 'NODE_ENV' variable to 'production'.
  
  So run:
  
  npm run start:prod
  
  And so now you see that our 'NODE_ENV' variable is actually set to production.
  
  And if now do a request from Postman, we will then not get our logger in the console: 
  production
  App running on 3000...
  Hello from the middleware 👋
  2022-05-18T11:26:41.056Z
  
  Let's go back to our development script, so 'npm run start:dev' and this time when we make a request from Postman, we will get our logger back:

  development
App running on 3000...
Hello from the middleware 👋
2022-05-18T11:29:09.153Z
GET /api/v1/tours 200 14.963 ms - 8746
  

*/
