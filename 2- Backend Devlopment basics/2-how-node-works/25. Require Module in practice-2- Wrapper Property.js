//Require Module in practice-2

//Wrapper property

//console.log(arguments);
console.log(require("module").wrapper); //To actually show you the wrapper function, we can require the module "module". So there's a module called "module", which we actually never used, but internally Node uses it. And in there, we have the wrapper. And so module "module" has this property 'wrapper', which is actually the wrapper function.
/*

Run node modules.js


OUTPUT: 

[
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
]


=> And so indeed you see export, require, module, filename and directory name, and then the function body. And so this template is what Node internally uses,  and then fills up the body of this function with our code.

*/
