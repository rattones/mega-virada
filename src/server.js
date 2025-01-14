const http = require('http');
const url = require('url');

module.exports = class Server {

  constructor() {
    //create a server object:
    http.createServer(function (req, res) {
      console.log('params', {url: url.parse(req.url.pathname, true), res});
      res.write('Hello World!'); //write a response to the client
      res.end(); //end the response
    }).listen(8080); //the server object listens on port 8080
  }
}
