//Event Loop in practice-3

const fs = require("fs");

setTimeout(() => console.log("Timer 1 finished"), 0);
setImmediate(() => console.log("Immediate 1 finished"));

// I/O task
fs.readFile("test-file.txt", () => {
  console.log("I/O finished");
  console.log("-----------------------");

  setTimeout(() => console.log("Timer 2 finished"), 0);
  setTimeout(() => console.log("Timer 3 finished"), 3000);
  setImmediate(() => console.log("Immediate 2 finished"));

  process.nextTick(() => console.log("Process.nextTick")); //Adding another queue
});

console.log("Hello from the top-level code"); //Top Level code

/*
 Run node event-loop.js

 OUTPUT:

Process.nextTick        ///This will be output first as it is from extra queue which is executed after each phase. NextTick actually happens before the next loop phase, and not the entire tick.

Immediate 2 finished
Timer 2 finished
Timer 3 finished

 

-------------------------------

so 'setImmediate' actually gets executed once per tick, while 'nextTick' gets executed immediately.



 */
