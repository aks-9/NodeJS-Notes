//* Require Module in practice-7

//importing export properties

// #1 module.exports
const C = require("./test-module-1");
const calc1 = new C();
console.log(calc1.add(2, 5));
console.log("------------------");

// #2 Using exports properties
const calc2 = require("./test-module-2");
console.log(calc1.add(2, 5));
console.log("------------------");

// # 3 Destructuring
const { add, multiply, divide } = require("./test-module-2"); //since we're getting an object, we can use the power of ES6 destructuring. We use the curly braces, and then we simply create variable names for the properties in that object, and these variable names actually have to be the exact same names as in the original object.
console.log(add(2, 5));
console.log(multiply(2, 5));
console.log(divide(10, 5));

//we can actually import only the ones that we want as well. So let's say we only want 'add' and 'multiply'. And so we will only get access to these two, instead of importing everything from the module.

/*

Run node modules.js


OUTPUT: 

7
------------------
7
------------------
7
10
2

=> All three ways are working correctly.


*/
