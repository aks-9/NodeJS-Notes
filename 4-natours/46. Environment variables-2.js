//* Environment variables-2

//This is 'server.js' file.

/*
Now these variables, they come from the 'process' core module and they're set at the moment that the 'process' started. And we didn't have to require the 'process' module, it is simply available everywhere automatically. 

Now in Express, many packages depend on a special variable called "NODE_ENV". So it's a variable that's kind of a convention which should define whether we're in development or in production mode.

However Express does not really define this variable, and so we have to do that manually. And there are multiple ways in which we can do it, but let's start with the easiest one which is to use the terminal.

Close the current process with ctrl + c , and clear the console.

when we last started this process we did it using 'npm start' that stands for 'nodemon server.js'

But if you want to set an environment variable for this process, we need to pre-plan that variable to this command:

FOR LINUX: NODE_ENV=development nodemon server.js

FOR WINDOWS: SET NODE_ENV=production&& nodemon server.js

We can also modify it more like:

FOR LINUX: NODE_ENV=development X=23 nodemon server.js

FOR WINDOWS: SET NODE_ENV=production&& X=23&& nodemon server.js



So again many packages on npm that we use for Express development actually depend on this environment variable. And so when our project is ready and we are gonna deploy it, we then should change the NODE_ENV and variable to production.


we usually use environment variables like configuration settings for our applications. So whenever our app needs some configuration for stuff that might change based on the environment that the app is running in, we use environment variables. 

For example we might use different databases for development and for testing until we could define one variable for each and then activate the right database according to the environment. Also we could set sensitive data like passwords and user name using environment variables.
*/

const app = require("./app");

// console.log(app.get('env'));

console.log(process.env);

//* START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
