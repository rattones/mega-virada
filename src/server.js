const http = require('http');
const url = require('url');
const Generator = require('./generator');
const SqliteManipulation = require('./sqlite-manipulation');
const CaixaService = require('./caixa-service');

module.exports = class Server {

  pathname = null;

  gen = null;
  params = null;

  db = null;
  caixa = null;

  constructor() {

    //create a server object:
    http.createServer(async function (req, res) {
      // this.res = res;
      // this.req = req;
      this.gen = new Generator();
      this.db = new SqliteManipulation();
      this.caixa = new CaixaService();

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
      // console.log('params', this.params);

      if (this.params[1] == 'sorte') {
      // console.log('params', {url: url.parse(req.url, true).pathname, req});
      // res.write(this.gen.generateBet().join(' - ')); //write a response to the client;
        let sorte = [];
        let max = this.params[2] || 3;
        max = max > 10 ? 10 : max; // limitando a 10 apostas
        for (let i= 1; i<=max; i++) {
          sorte.push(await ` > ${i.toString().padStart(2, ' ')}: ${showBet(this.gen.generateBet())}`);
        }
        sorte = sorte.join('\r\n');
        res.write('Sorte gerada com sucesso!\r\n' + sorte);
      }

      if (this.params[1] == 'resultado') {

        let concurso = await this.db.getConcurso(this.params[2]);
        let str = '';
        if (concurso) {
          console.log('resultado concurso', concurso);
          str = `Concurso: ${concurso.numero}
Data do sorteio: ${this.caixa.toData(concurso.data_sorteio)}
Numeros sorteados: ${showBet([concurso.bola1, concurso.bola2, concurso.bola3, concurso.bola4, concurso.bola5, concurso.bola6])}

 6 acertos: ${concurso.ganhadores6.toString().padStart(6, ' ')} - ${this.caixa.toCurrency(concurso.rateio6)}
 5 acertos: ${concurso.ganhadores5.toString().padStart(6, ' ')} - ${this.caixa.toCurrency(concurso.rateio5)}
 4 acertos: ${concurso.ganhadores4.toString().padStart(6, ' ')} - ${this.caixa.toCurrency(concurso.rateio4)}
          `;
        } else {
          str = `
          Concurso ${this.params[2]} nao encontrado!
          `;
        }
        res.write(str, 'utf8', {'Content-Type': 'text', 'charset': 'utf-8'});
      }


      res.end(); //end the response

    }).listen(8090); //the server object listens on port 8080

  }

}
