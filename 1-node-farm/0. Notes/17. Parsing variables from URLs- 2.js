//* Parsing variables from URLs- 2

//This is 'index.js'

const fs = require("fs");
const http = require("http");
const url = require("url");

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
const dataObj = JSON.parse(data);

const replaceTemplate = (template, product) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true); //Using ES6 destructuring, extracting properties from an object to multiple variables of same name as the property. Notice the "pathName" has been now renamed as "pathname" throughout the code.

  //Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((element) => replaceTemplate(tempCard, element))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS", cardsHtml);
    res.end(output);
  }

  //Product page
  else if (pathname === "/product") {
    // This will be loaded even for id=0, as pathname is still /product from the object.
    console.log(query); //logging the query in the terminal: [Object: null prototype] { id: '0' }
    res.writeHead(200, { "Content-type": "text/html" }); //Writing Headers.

    const product = dataObj[query.id]; //query.id will fetch the 'id' property from the query.
    const output = replaceTemplate(tempProduct, product); // passing the product at a specific id

    res.end(output); //sending response.
  }

  //API page
  else if (pathname === "/api") {
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

Restart the server and refresh the page of id=0, and you should see product detail page from id=0
Make some changes to the template-product.html file to enable back button. Just put /overview instead of # in the link.

*/
