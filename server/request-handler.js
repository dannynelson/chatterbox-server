/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

exports.handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  var statusCode;
  console.log("Serving request type " + request.method + " for url " + request.url);
  if (request.url == "http://127.0.0.1:8080/classes/room1") {
    if (request.method === "GET") {
      statusCode = 200;
    }
    if (request.method === "POST") {
      statusCode = 201;
      request.setEncoding('utf8');
      request.on('data', function(data) {
        thisResponse.push(JSON.parse(data));
        console.log(thisResponse);
      });
    }
  } else {
    statusCode = 404;
  }



  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;
  
  headers['Content-Type'] = "application/json";

  /* .writeHead() tells our server what HTTP status code to send back */
  response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  // if (request.method === "GET") {
  //   thisResponse = responseObj;
  // } else 

  console.log(thisResponse);
  response.end(JSON.stringify(thisResponse));
};

var thisResponse = [];


/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var responseObj = {};
// responseObj.results = [
//   {
//     createdAt: "2013-10-07T16:22:03.280Z",
//     objectId: "teDOY3Rnpe",
//     roomname: "lobby",
//     text: "hello",
//     updatedAt: "2013-10-07T16:22:03.280Z",
//     username: "gary"
//   }, 
//   {
//     createdAt: "2013-10-07T16:22:03.280Z",
//     objectId: "teDOY3Rnpe",
//     roomname: "lobby",
//     text: "wassup",
//     updatedAt: "2013-10-07T16:22:03.280Z",
//     username: "gary"
//   }
// ];
