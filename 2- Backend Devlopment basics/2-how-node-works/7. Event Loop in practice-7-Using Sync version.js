//Event Loop in practice-7

//Using Sync version will block the thread pool

const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 1;

setTimeout(() => console.log("Timer 1 finished"), 0);
setImmediate(() => console.log("Immediate 1 finished"));

fs.readFile("test-file.txt", () => {
  console.log("I/O finished");
  console.log("----------------");

  setTimeout(() => console.log("Timer 2 finished"), 0);
  setTimeout(() => console.log("Timer 3 finished"), 3000);
  setImmediate(() => console.log("Immediate 2 finished"));

  process.nextTick(() => console.log("Process.nextTick"));

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512"); //Using the "sync" version of the function.
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512"); //Using the "sync" version of the function.
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512"); //Using the "sync" version of the function.
  console.log(Date.now() - start, "Password encrypted");

  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512"); //Using the "sync" version of the function.
  console.log(Date.now() - start, "Password encrypted");
});

console.log("Hello from the top-level code");

/*
 Run node event-loop.js

 OUTPUT:
 
Hello from the top-level code
Timer 1 finished    
Immediate 1 finished
I/O finished
----------------
1180 Password encrypted
2301 Password encrypted
3434 Password encrypted
4578 Password encrypted
Process.nextTick
Immediate 2 finished
Timer 2 finished
Timer 3 finished







 */
