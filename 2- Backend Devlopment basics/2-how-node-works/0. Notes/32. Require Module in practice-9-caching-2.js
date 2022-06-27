//Require Module in practice-9

//caching-2
//This is modules.js

// caching
require("./test-module-3")(); //calling the function right away without saving it to a variable.
require("./test-module-3")();
require("./test-module-3")();

/*

Run node modules.js


OUTPUT: 

Hello from the module         ///From module
Log this beautiful text 😍   ///From module

Log this beautiful text 😍   ///From cache
Log this beautiful text 😍   ///From cache


So we have this logging here three times, because we called the same function three times. But we have 'Hello from the module' only once. And that is because of caching. So technically this module was only loaded once, and so the code inside of it was also executed once only. 

And so that's why this line of code here, this logging was only run once. And so the other two loggings, they came from cache, so they were stored somewhere in the Node's processes cache. And once we called the function for the second time, it was simply retrieved from there, instead of loading the module again.



*/
