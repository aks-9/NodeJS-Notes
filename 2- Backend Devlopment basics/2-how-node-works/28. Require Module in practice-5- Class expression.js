//Require Module in practice-5

//This is test-module-1.js

//Using Class expression instead of Class declaration.

//Class declaration:
// class Calculator {
//   add(a, b) {
//     return a + b;
//   }

//   multiply(a, b) {
//     return a * b;
//   }

//   divide(a, b) {
//     return a / b;
//   }
// }

//Class expression. This is a class assigned to a variable. And so that's now an expression.
module.exports = class {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
};

/*
Go to file modules.js

Run node modules.js

It will still give us the same previous output.

OUTPUT: 7

=> This means that our class expression is working.


*/
