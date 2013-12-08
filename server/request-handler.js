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

var OPTIONSResponse = function(request, response) {
  sendResponse(response);
};

var POSTResponse = function(request, response) {
  request.setEncoding('utf8');
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    data = JSON.parse(data);
    data = addMessageAttributes(data);
    responseObj.results.push(data);
  });
  sendResponse(response, 201);
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
  var order = url.parse(request.url, true).query.order;
  if (order[0] === '-') {
    order = order.substring(1);
    responseObj.results = responseObj.results.sort(function(a, b) {
      return (new Date(b[order])) - (new Date(a[order]));
    });
  } else {
    responseObj.results = responseObj.results.sort(function(a, b) {
      return (new Date(a[order])) - (new Date(b[order]));
    });
  }
};

var actionList = {
  'GET': GETResponse,
  'POST': POSTResponse,
  'OPTIONS': OPTIONSResponse
};

exports.handleRequest = function(request, response) {
  var statusCode;
  console.log("Serving request type " + request.method + " for url " + request.url);
  actionList[request.method](request, response);
};
