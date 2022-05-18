//Event Loop in practice-5

/*Multiple tasks in thread pool. 



*/

const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();

setTimeout(() => console.log("Timer 1 finished"), 0);
setImmediate(() => console.log("Immediate 1 finished"));

// I/O task
fs.readFile("test-file.txt", () => {
  console.log("I/O finished");
  console.log("-----------------------");

  setTimeout(() => console.log("Timer 2 finished"), 0);
  setTimeout(() => console.log("Timer 3 finished"), 3000);
  setImmediate(() => console.log("Immediate 2 finished"));

  process.nextTick(() => console.log("Process.nextTick"));

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  }); //Duplicating

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  }); //Duplicating

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  }); //Duplicating

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "Password encrypted");
  }); //Duplicating

  //By default the size of the thread pool is 4, so there are 4 threads doing the work at the same time, and so that's why these four password encryptions take approximately the same time and happen basically all at the same time. But we can actually change that thread pool size.
});

console.log("Hello from the top-level code"); //Top Level code

/*
 Run node event-loop.js

 OUTPUT:

 Hello from the top-level code
Timer 1 finished    
Immediate 1 finished
I/O finished
-----------------------
Process.nextTick
Immediate 2 finished
Timer 2 finished
2230 Password encrypted
2248 Password encrypted
2250 Password encrypted
2253 Password encrypted





 */
