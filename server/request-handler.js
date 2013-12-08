/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  'Content-Type': "application/json"
};

var responseObj = {};
responseObj.results = [
  {
    createdAt: "2013-10-07T16:22:03.280Z",
    objectId: "teDOY3Rnpe",
    roomname: "lobby",
    text: "hello",
    updatedAt: "2013-10-07T16:22:03.280Z",
    username: "gary"
  },
  {
    createdAt: "2013-10-07T16:22:03.280Z",
    objectId: "teDOY3Rnpe",
    roomname: "lobby",
    text: "wassup",
    updatedAt: "2013-10-07T16:22:03.280Z",
    username: "gary"
  }
];

var sendResponse = function(statusCode, response, responseObj) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(responseObj));
};

exports.handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  var statusCode;
  console.log("Serving request type " + request.method + " for url " + request.url);
  var url = require('url');

    if (request.method === "GET") {
      statusCode = 200;

      var url_parts = url.parse(request.url, true);
      var query = url_parts.query;
      var order = query.order;
      if (order[0] === '-') {
        order = order.substring(1);
        console.log(responseObj.results);
        responseObj.results = responseObj.results.sort(function(a, b) {
          return (new Date(b[order])) - (new Date(a[order]));
        });
      }
    }
    if (request.method === 'OPTIONS') {
      statusCode = 200;
      console.log('!OPTIONS');
      headers = {};
      // IE8 does not allow domains to be specified, just the *
      headers["Access-Control-Allow-Origin"] = request.headers.origin;
      headers["Access-Control-Allow-Origin"] = "*";
      headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
      headers["Access-Control-Allow-Credentials"] = false;
      headers["Access-Control-Max-Age"] = '86400'; // 24 hours
      headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
      // response.writeHead(200, headers);
      // response.end();
    }
    if (request.method === "POST") {
      statusCode = 201;
      request.setEncoding('utf8');
      request.on('data', function(data) {
        data = JSON.parse(data);
        var date = new Date();
        date = date.toISOString();
        data['createdAt'] = date;
        data['updatedAt'] = date;
        responseObj.results.push(data);
        console.log(responseObj);
      });
    }
  sendResponse(statusCode, response, responseObj);
};

// var thisResponse = [];


/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */



