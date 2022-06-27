//* Require Module in practice-8

//caching-1

//Create a new file test-module-3.js in the root of project.

console.log("Hello from the module");

module.exports = () => console.log("Log this beautiful text 😍"); //to export a function. Just one single function.

//Now go to module.js and require this module. And we are not saving it to any variable. Instead we are going to call the function right away without saving it to a variable.
