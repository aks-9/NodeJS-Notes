//* HTML Template filling

//This is 'index.js'

const fs = require("fs");
const http = require("http");
const url = require("url");

//TOP LEVEL CODE.

//Reading the templates in synchronous way.
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data); //An array of all the objects in data.json file. We have to loop through this array using map() before sending a response for overview page, and for each of the objects, replace the placeholders in the template with the actual data from the current product

//Function to replace the placeholders in a template. It will take two arguments, first is a template and second is an element(product) while looping through the dataObj array.
const replaceTemplate = (template, product) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName); //Using replace method on 'template'. First argument is the placeholder wrapped in a regular expression, where 'g' means a global flag to ensure it replaces all the placeholders that are found and not just the first one. The second argument is accessing the property of an element in the 'dataObj' array.

  output = output.replace(/{%IMAGE%}/g, product.image); //it's not a good practice to directly manipulate the arguments that we pass into a function, like we did with 'template' in the previous line of code and saved it in a new variable 'output'. So from now on, manipulate that first one (output) only. That's why we used 'let' instead of 'const', because we can mutate a variable declared with 'let'.

  //Updating a product's other properties in a placholder.
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    //organic property of a product is a 'bool'.
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic"); //'not-organic' is a class.

  return output;
};

const server = http.createServer((req, res) => {
  const pathName = req.url;

  //Overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" }); //Declaring header and error code.

    const cardsHtml = dataObj
      .map((element) => replaceTemplate(tempCard, element))
      .join(""); //we're gonna loop through 'dataObj' with a map() because we want to return something and that something, we will save into a new array.

    //map() accepts a callback function and this callback function gets a current 'element' as an argument, so the 'element' of the current loop and whatever we return here will then be saved into an array.

    console.log(cardsHtml); //Should print the cards's html in the terminal after restarting the server and refreshing the webpage. The join('') will concatenate the array into a string.

    const output = tempOverview.replace("{%PRODUCT_CARDS", cardsHtml);

    // res.end(tempOverview); //sending tempOverview as a response.
    res.end(output); // sending the output.
  }

  //Product page
  else if (pathName === "/product") {
    res.end("This is the PRODUCT!");
  }

  //API page
  else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }

  //Not Found page
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found! </h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to new requests on port 8000");
});

/*


*/
