//* Environment variables-1

//This is 'server.js' file.

//So node JS, or Express apps, can run in different environments. And the most important ones are the 'development' environment and the 'production' environment. That's because depending on the environment, we might use different databases for example, or we might turn logging on or off, or we might turn debugging on or off, or really all kinds of different settings that might change depending on the development that we're in.

//The most important ones are the 'development' and the 'production' environment. But there are other environments that bigger teams might use. So this type of settingslike different databases or logging turned on or off, that will be based on environment variables. Now by default, Express sets the environment to 'development'.

//So remember that everything that is not related to Express we're gonna do it outside of the 'app.JS' file. So we only use 'app.JS' file to configure everything that has to do with the Express application.

const app = require("./app");

console.log(app.get("env")); //logging the current environment variable. This will print in terminal's console 'development'.

//So in summary, environment variables are global variables that are used to define the environment in which a node app is running. So this one is set by Express, but node JS itself actually sets a lot of environments. Now this env variable here is actually set by Express, but node JS itself actually also sets a lot of environment variables that are located at 'process.env'.

console.log(process.env); //This prints in terminal's console all the environment variables that node uses.

//* START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
