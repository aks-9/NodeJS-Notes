//* Require Module in practice-6

// add properties to the exports object .

//Creating three anonymous functions, and assigned them to three properties of exports.And so now when we export this module, in modules.js we will get access to this exports object.

exports.add = (a, b) => a + b;
exports.multiply = (a, b) => a * b;
exports.divide = (a, b) => a / b;

//Go to modules.js and import these.
