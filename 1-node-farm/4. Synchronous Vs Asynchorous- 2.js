//Synchronus (Blocking) vs Asynchronus (Non-Blocking) code in practice

//This is 'index.js'

const fs = require("fs");

//Synchronous code (Blocking)
const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);
const textOut = `This is what we know: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written!");

//Asynchronous code (Non-Blocking)
fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
  console.log(data);
}); //The first argument in the fs.readFile() is the path to the file to be read. The second argument is the format. The third is a callback function. As soon as the file is read, then we will execute the 'callback' function in the third argument. The callback function has two arguments. The first when is a varible 'err' and the seocnd one is the actual 'data' that is read from the path.
console.log("Will read file!"); // This will be printed first as the async code above it is still working in background
