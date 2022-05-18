//Event Loop in practice-4

//Offloading to thread pool.

const fs = require("fs");
const crypto = require("crypto"); //Using cryptography module to encrypt a password. All the functions from this package will be offloaded to the thread pool by the event pool.

const start = Date.now(); //Current date in milliseconds.To show how much time each of the operations take.

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
    //Using an encryption function. First argument is the password to be encrypted, second is a string to solve the encryption. Third is no. of iterations, then fourth is keylength, and last argument is the name of the algo to perform the encryption.
    console.log(Date.now() - start, "Password encrypted"); //Printing amount of time since start.
  });
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
1066 Password encrypted
Timer 3 finished





 */
