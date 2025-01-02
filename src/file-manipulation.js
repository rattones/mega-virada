const fs = require('fs');
const CaixaService = require('./caixa-service.js');

module.exports = class FileManipulation {
  megaSenaData = null;
  cs = new CaixaService();

  constructor() {
    // Read the JSON file
    this.megaSenaData = JSON.parse(fs.readFileSync('./data/mega-sena.json', 'utf8'));
    this.updateData();
    // console.log('file-manipulation', this.megaSenaData);
  }

  getData(concurso = null) {
    if (concurso == null) {
      return this.megaSenaData;
    }
    return this.megaSenaData.find(item => (item.Concurso == concurso));
  }

  writeData(data) {
    fs.writeFileSync('./data/mega-sena.json', JSON.stringify(data), 'utf8');
  }

  async updateData() {
    const novoConcurso = await this.cs.getData();
    if (!this.megaSenaData.find(item => (item.Concurso == novoConcurso.Concurso))) {
      console.log('atualizando', novoConcurso);
      this.megaSenaData.push(novoConcurso);
      this.writeData(this.megaSenaData);
    }

  }

}
