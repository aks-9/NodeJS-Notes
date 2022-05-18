//Events in practice-3

//Using a custom class for an emitter.

const EventEmitter = require("events");

// const myEmitter = new EventEmitter(); //No need for this now.

//ES6 syntax for a new class. "Sales" is inheriting from "EventEmitter" class.
class Sales extends EventEmitter {
  constructor() {
    super(); //we getting access to all the methods of the parent "EventEmitter" class
  }
}

const myEmitter = new Sales(); //creating an instance of Sales class

myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});

myEmitter.on("newSale", () => {
  console.log("Customer name: Jonas");
});

myEmitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit("newSale", 9);

//--------------------------------------------------------------------------------

/*
RUN node events.js 

OUTPUT:

There was a new sale!
Customer name: Jonas
There are now 9 items left in stock.


=> Working as expected with a custom class

 */
