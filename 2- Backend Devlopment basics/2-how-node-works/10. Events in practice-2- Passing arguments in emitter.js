//Events in practice-2

//Passing arguments to the event listener

const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.on("newSale", () => {
  console.log("There was a new sale!");
});

myEmitter.on("newSale", () => {
  console.log("Customer name: Jonas");
});

//A listener to use the additional argument passed in emitter. Other listners will not process the additional argument passed by the emitter.
myEmitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit("newSale", 9); //Passing arguments to the event listener, by passing them as an additional argument in the emitter.

/*
RUN node events.js 

OUTPUT:

There was a new sale!
Customer name: Jonas
There are now 9 items left in stock.


=> If we have multiple listeners for the same event, then they will run synchronously. So one after the other in the order that they were in the code. 

But if you were to use this pattern in real life, then it's a best practice to create a new class that will actually inherit from the node EventEmitter. We will do that in the next part.

 */
