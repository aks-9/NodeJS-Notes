//Streams in practice-2

//Using Streams

//Instead of reading the data into a variable, and having to store that variable into memory, we will just create a readable stream. Then as we receive each chunk of data, we send it to the client as a response which is a writable stream.

const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  //Solution 1
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });

  // Solution 2: Using Streams
  const readable = fs.createReadStream("test-file.txt"); //Using a method "createReadStream" from 'fs' module and saving it in a variable called 'readable'. So this now creates a stream from the data that is in this text file, which we can then consume piece by piece.

  //Each time there is a new chunk of data that we can consume, a readable stream emits the "data" event, so we can listen to that event.

  readable.on("data", (chunk) => {
    res.write(chunk); //writing the 'chunk' to a response, which is a writable stream. So we're streaming the content from the file right to the client.
  });

  readable.on("end", () => {
    //When all of the data has been read.
    res.end(); //we're not passing anything into this 'end' method, as we already sent all the data using res.write, chunk by chunk.
  });

  //There is another event that we can listen to on a readable stream, which is the "error" event. Mis-spell the file name to see the error.
  readable.on("error", (err) => {
    console.log(err);
    res.statusCode = 500; //Sending error code.
    res.end("File not found!");
  });
});

//Starting the server:
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});

/*

Run node streams.js 

Go to http://127.0.0.1:8000/

And it will still work.


*/
