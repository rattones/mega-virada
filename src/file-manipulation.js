const fs = require('fs');
const CaixaService = require('./caixa-service.js');

module.exports = class FileManipulation {
  // Array que armazena os dados dos sorteios da Mega Sena
  megaSenaData = [];
  // Instância do serviço que busca dados da Caixa
  cs = new CaixaService();

  constructor() {
    // Lê o arquivo JSON com histórico de sorteios
    this.megaSenaData = JSON.parse(fs.readFileSync('./data/mega-sena.json', 'utf8'));
    // Atualiza os dados buscando último concurso
    this.updateData();
  }

  /**
   * Retorna dados dos sorteios
   * @param {number} concurso - Número do concurso específico (opcional)
   * @returns {Array|Object} Retorna todos os sorteios ou um concurso específico
   */
  getConcurso(concurso = null) {
    if (concurso == null) {
      return this.megaSenaData;
    }
    return this.megaSenaData.find(item => (item.Concurso == concurso));
  }

  /**
   * Salva os dados no arquivo JSON
   * @param {Array} data - Array com dados dos sorteios
   */
  writeData(data) {
    console.log('Reescrevendo arquivo JSON');
    fs.writeFileSync('./data/mega-sena.json', JSON.stringify(data), 'utf8');
  }

  /**
   * Atualiza o arquivo JSON com novo sorteio se disponível
   * Busca último resultado via CaixaService e adiciona se for novo
   */
  async updateData() {
    const novoConcurso = await this.cs.getConcurso();
    // Verifica se o concurso já existe antes de adicionar
    if (!this.megaSenaData.find(item => (item.Concurso == novoConcurso.Concurso))) {
      console.log('atualizando', novoConcurso);
      this.megaSenaData.push(novoConcurso);
      console.log('Atualizando dados do JSON');
      this.writeData(this.megaSenaData);
    }

  }

}
