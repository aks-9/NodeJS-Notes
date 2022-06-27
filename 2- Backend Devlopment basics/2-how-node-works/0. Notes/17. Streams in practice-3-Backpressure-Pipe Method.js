//Streams in practice-3

//Backpressure Problem.

//Our readable stream, is much much faster than the response writable stream over the network. And this will overwhelm the response stream, which cannot handle all this incoming data so fast. And this problem is called backpressure. So in this case, backpressure happens when the response cannot send the data nearly as fast as it is receiving it from the file.

//We will overcome this using the 'Pipe' function. The 'pipe' operator is available on all readable streams, and it allows us to pipe the output of a readable stream right into the input of a writable stream. And that will then fix the problem of backpressure because it will automatically handle the speed basically of the data coming in, and the speed of the data going out.

const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Solution 3: So to fix the backpressure problem, all we have to do is to take our readable stream, use the pipe method on it, and then put in a writable stream and that is the response.
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
  // Syntax: readableSource.pipe(writeableDestination);

  //Now this stream here can actually be a duplex or a transform stream as well, but what matters is that we can write to the stream. And 'response' of course, is such a stream. So we can of course write to the response that will be sent to the client.
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});

/*

Run node streams.js 

Go to http://127.0.0.1:8000/

And it will still work.


*/
