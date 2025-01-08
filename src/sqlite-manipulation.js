const FM = require('./file-manipulation.js');
const CS = require('./caixa-service.js');
const sqlite3 = require('sqlite3');

module.exports = class SqliteManipulation {
  /** Inicializa conexão com banco SQLite */
  db = new sqlite3.Database('./data/megasena.db');
  // Instancia serviço da Caixa
  caixa = new CS();

  /**
   * Converte dados JSON para o banco SQLite
   * Percorre todos os concursos e insere no banco
   */
  convertJSONtoDB() {
    // Carrega dados do arquivo via FileManipulation
    megaSenaData = new FM().getConcurso();
    console.log('Iniciando conversão do arquivo de Concursos de JSON para SQLite');
    for(let i=0; i<this.megaSenaData.length; i++) {
      let element = this.megaSenaData[i];
      this.insertConcurso(element);
    };
    console.log('Conversão concluída');
  }

  /**
   * Atualiza concursos buscando últimos dados da API da Caixa
   * Verifica último concurso no banco e insere novo se existir
   */
  async updateConcursos() {
    const dadosSorteio = await this.caixa.getConcurso();
    // Verifica último concurso no banco
    this.db.get('SELECT max(numero) as concurso FROM concursos', (err, rows) => {
      // Insere novo concurso se não existir
      if (dadosSorteio.Concurso != rows.concurso) {
        console.log('Inserindo novo concurso');
        this.insertConcurso(dadosSorteio);
      } else {
        console.log('Último concurso já inserido');
      }
    });
  }

  /**
   * Insere dados de um concurso no banco
   * @param {Object} concurso - Objeto com dados do concurso
   */
  insertConcurso(concurso) {
    const query = `INSERT INTO concursos (numero,
                data_sorteio,
                bola1,
                bola2,
                bola3,
                bola4,
                bola5,
                bola6,
                hash_sorteio,
                ganhadores6,
                rateio6,
                ganhadores5,
                rateio5,
                ganhadores4,
                rateio4
              ) VALUES (${concurso.Concurso},
                '${concurso['Data do Sorteio']}',
                ${concurso.Bola1},
                ${concurso.Bola2},
                ${concurso.Bola3},
                ${concurso.Bola4},
                ${concurso.Bola5},
                ${concurso.Bola6},
                '${this.getHashSorteio([concurso.Bola1, concurso.Bola2, concurso.Bola3, concurso.Bola4, concurso.Bola5, concurso.Bola6])}',
                ${concurso['Ganhadores 6 acertos']},
                ${this.toValue(concurso['Rateio 6 acertos']) || 0},
                ${concurso['Ganhadores 5 acertos']},
                ${this.toValue(concurso['Rateio 5 acertos']) || 0},
                ${concurso['Ganhadores 4 acertos']},
                ${this.toValue(concurso['Rateio 4 acertos']) || 0}
              );`;
    // console.log(query);
    console.log(`Inserindo dados do concurso: ${concurso.Concurso}`);
    this.db.exec(query);
  }

  /**
   * Busca um concurso específico pelo hash
   * @param {string} hash - Hash do concurso a ser buscado
   * @returns {Object} Dados do concurso correspondente ao hash
   */
  getConcursoByHash(hash) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM concursos WHERE hash_sorteio = ?', [hash], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows? rows: false);
        }
      });
    });
  }

  // ======================= UTILS ======================= //

  /**
   * Gera hash identificador único do sorteio concatenando números
   * @param {Array} sorteio - Array com números sorteados
   * @returns {string} Hash gerada com números concatenados
   */
  getHashSorteio(sorteio) {
    return sorteio.reduce((acc, curr) => `${acc}+${curr}`, '');
  }

  /**
   * Converte string de valor monetário para número
   * @param {string} curr - String com valor monetário
   * @returns {number} Valor convertido para número
   */
  toValue(curr) {
    return parseFloat(curr.replace('R$', '').replaceAll(' ', '').replaceAll('.', '').replace(',', '.'));
  }
}
