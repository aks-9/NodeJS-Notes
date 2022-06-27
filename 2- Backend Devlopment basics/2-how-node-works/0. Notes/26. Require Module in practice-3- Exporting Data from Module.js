//* Require Module in practice-3

//Exporting data from one module to another.

//Create a new file, "test-module-1.js" in the root of the project.

//This is "test-module-1.js"

//Creating a JS class named Calculator with ES6 syntax
class Calculator {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    return a / b;
  }
}

module.exports = Calculator; //Exporting our module. We use 'module.exports' when we want to export one single value. And in this case our single value here is the Calculator class.

//We can then save the exported value to a variable when importing it in the 'modules.js'. So go to 'modules.js'.
