//Event Loop in practice-1

//Create a new file event-loop.js in the root project directory.

const fs = require("fs");

setTimeout(() => console.log("Timer 1 finished"), 0); //Using arrow function in setTimeout function as a callback. Second argument is the timer in milliseconds. This will expire after 0 seconds.
setImmediate(() => console.log("Immediate 1 finished")); //Will run immediatly after I/O task.

// I/O task
fs.readFile("test-file.txt", () => {
  console.log("I/O finished");
});

console.log("Hello from the top-level code"); //Top Level code

/*
Run node event-loop.js

 OUTPUT:

Hello from the top-level code   /// Top-level code printed first.

Timer 1 finished    /// Random order as not in a callback.

Immediate 1 finished /// Random order as not in a callback.

I/O finished   /// I/O task finishes last as it takes some time to read.




 */
