//* Synchronus (Blocking) vs Asynchronus(Non-Blocking) code

//This is 'index.js'
const fs = require("fs");

//Synchronous code
// sequential execution of the code.
const input = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(input);

//Asynchronous code
const input2 = fs.readFile("./txt/input.txt", "utf-8", (err, data) => {
  //Reading a file can be a time taking task, so it will be pushed in background. Notice the method used on 'fs' is 'readFile' and not 'readFileSync'.
  console.log(data);
});

console.log("Reading file..."); //proceed with the next line of code, while the Reading task is working in background.

//Once the background task is done, a callback function that we register before, is called to handle the result.
