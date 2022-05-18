//Event Loop in practice-2

const fs = require("fs");

setTimeout(() => console.log("Timer 1 finished"), 0);
setImmediate(() => console.log("Immediate 1 finished"));

// I/O task
fs.readFile("test-file.txt", () => {
  console.log("I/O finished");
  console.log("-----------------------");

  setTimeout(() => console.log("Timer 2 finished"), 0); //Putting in callback
  setTimeout(() => console.log("Timer 3 finished"), 3000); //Timer of 3 seconds.

  setImmediate(() => console.log("Immediate 2 finished")); //Will be executed first.
});

console.log("Hello from the top-level code"); //Top Level code

/*
 Run node event-loop.js

 The timer 3 will run for 3 seconds, so node will not exit before that.


 These four outputs are not running in the event loop:

Hello from the top-level code
Timer 1 finished    
Immediate 1 finished
I/O finished

-----------------------

These 3 are running in event loop:

Immediate 2 finished   
Timer 2 finished       
Timer 3 finished

-----------------------

Notice that 'Immediate 2' is finishing before 'Timer 2', although 'Timer 2'  has a timer of 0 and was written earlier than 'Immediate 2'.

This is because the event loop actually WAITS for stuff to happen in the poll phase, where I/O callbacks are handled. 

So when the callback queue is empty, which is the case in our fictional example here, so we have no I/O callbacks, all we have is these timers, then the event loop will wait in this phase until there is an expired timer.


But, if we scheduled a callback using 'setImmediate', then that callback will actually be executed right away after the polling phase, and even before expired timers, if there is one.


And in this case, the timer expires right away, so after zero seconds, but again, the event loop actually waits, so it pauses in the polling phase. And so that 'setImmediate' callback is actually executed first.


 */
