//Require Module in practice-4

//Importing data from another module.

const C = require("./test-module-1"); //Importing our 'test-module-1' and saving it in a variable 'C'. We can actually give any name that we want. So the name that we are exporting on the other side doesn't matter. And since it's our own module, we have to use the dot slash in the path.

//And remember, we are actually importing a class here. So we can now use that class to do some calculations.

const calc1 = new C(); //creating a new instance of a calculator

console.log(calc1.add(2, 5)); //Using 'add' method on our class instance, which is defined in the imported "test-module.js".

/*

Run node modules.js


OUTPUT: 7


*/
