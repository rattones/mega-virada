const path = require('path');

const analyzer = require('./src/analyzer.js');

const basePath = __dirname;

console.log(basePath);

const CaixaService = require('./src/caixa-service.js');

async function teste() {
  const t = new CaixaService();
  const x = await t.getData()
  console.log('teste', x);
}

teste();
