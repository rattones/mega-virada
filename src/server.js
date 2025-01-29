const http = require('http');
const url = require('url');
const Generator = require('./generator');

module.exports = class Server {

  pathname = null;
  // req = null;
  // res = null;

  gen = null;
  params = null;

  constructor() {

    //create a server object:
    http.createServer(async function (req, res) {
      // this.res = res;
      // this.req = req;
      this.gen = new Generator();

      function showBet(bet) {
        bet = bet.map(i => i.toString().padStart(2, ' '))
        return bet.join(' - ');
      }

      this.pathname = url.parse(req.url, true).pathname;
      console.log('pathname', this.pathname);

      if (this.pathname == '/favicon.ico') { // favicon.ico
        res.write('Hello World!'); //write a response to the client
        res.end(); //end the response
      }

      this.params = this.pathname.split('/');
      console.log('params', this.params);

      if (this.params[1] == 'sorte') {
      // console.log('params', {url: url.parse(req.url, true).pathname, req});
      // res.write(this.gen.generateBet().join(' - ')); //write a response to the client;
        let sorte = [];
        let max = this.params[2] || 3;
        max = max > 10 ? 10 : max; // limitando a 10 apostas
        for (let i= 1; i<=max; i++) {
          sorte.push(await `${i.toString().padStart(2, ' ')}: ${showBet(this.gen.generateBet())}`);
        }
        sorte = sorte.join('\n\r');
        res.write('Sorte gerada com sucesso!\n\r' + sorte);
      }
      res.end(); //end the response

    }).listen(8090); //the server object listens on port 8080

  }

}
