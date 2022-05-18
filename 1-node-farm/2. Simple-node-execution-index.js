//Read and Write files

//This is 'index.js'

const fs = require("fs"); //importing filesystem module to read and write files.

//Reading Files
const textIn = fs.readFileSync("./txt/input.txt", "utf-8"); //first argument is path to the file, second is format.

console.log(textIn);

const textOut = `This is what we know: ${textIn}.\nCreated on ${Date.now()}`; //using backticks, ES6 syntax and Date() function.

//writing to a file.
fs.writeFileSync("./txt/output.txt", textOut); //First argument is path to the file, second argument is the variable that has text we want to write.

console.log("File written!");

/* run the command: 

node index.js 

and it should create a file called output.txt in the 'txt' folder of the root project folder. It will have the text that was saved in 'textOut' varible.

*/
