const SqliteManipulation = require('./sqlite-manipulation.js');

module.exports = class Analiser {
  // Instância do serviço que manipula o banco de dados
  db = new SqliteManipulation();
  numbers = [];

  /**
   * Busca todos os sorteios existentes
   */
  async getNumbers() {
    this.numbers = await this.db.getAllNumbers();
  }

  /**
   * Organiza os números pela quantidade de vezes que ele foi sorteado
   * @returns {Array} Números contabilizados em quantas vezes foram sorteados
   */
  async countNumbers() {
    await this.getNumbers();
    let numeros = [];
    this.numbers.forEach(row => {
      let sorteio = [];
      sorteio.push(row.bolas[0]);
      sorteio.push(row.bolas[1]);
      sorteio.push(row.bolas[2]);
      sorteio.push(row.bolas[3]);
      sorteio.push(row.bolas[4]);
      sorteio.push(row.bolas[5]);
      sorteio.forEach(element => {
        let find = numeros.find(x => x.numero === element);
        if (find) {
          find.qtd++;
        } else {
          numeros.push({numero: element, qtd: 1});
          // console.log('Novo número: ' + element);
        }
      });
      numeros.sort((a, b) => a.qtd - b.qtd);
    });

    return numeros;
  }

  async test() {
    console.log(this.numbers);
    console.log(await this.countNumbers());
    console.log('Rodou...');
  }

}

const Analiser = require('./analiser.js');
const a = new Analiser();
a.test();
