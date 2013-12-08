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

var objectId = 0;

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

var sendResponse = function(response, statusCode) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(responseObj));
};

var GETResponse = function(request, response) {
  sortByOrder(request);
  sendResponse(response);
};

var POSTResponse = function(request, response) {
  response.setEncoding('utf8');
  var data = '';
  response.on('data', function(chunk) {
    data += chunk;
  });
  response.on('end', function() {
    data = JSON.parse(data);
    data = addMessageAttributes(data);
    responseObj.results.push(data);
  });
  sendResponse(null, 201);
};

var OPTIONSResponse = function(request, response) {
  sendResponse(response);
};

var addMessageAttributes = function(data) {
  var date = new Date();
  date = date.toISOString();
  data['createdAt'] = date;
  data['updatedAt'] = date;

  objectId += 1;
  data['objectId'] = objectId;
  return data;
};

var sortByOrder = function(request) {
  var url = require('url');
  var url_parts = url.parse(request.url, true);
  var query = url_parts.query;
  var order = query.order;
  if (order[0] === '-') {
    order = order.substring(1);
    responseObj.results = responseObj.results.sort(function(a, b) {
      return (new Date(b[order])) - (new Date(a[order]));
    });
  }
};

var requestResponse = {
  'GET': GETResponse,
  'POST': POSTResponse,
  'OPTIONS': OPTIONSResponse
};

exports.handleRequest = function(request, response) {
  var statusCode;
  console.log("Serving request type " + request.method + " for url " + request.url);
  requestResponse[request.method](request, response);
};
