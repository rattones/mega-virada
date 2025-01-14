const path = require('path');

const Generator = require('./src/generator.js');
const SqliteManipulation = require('./src/sqlite-manipulation.js');

function showBet(bet) {
  bet = bet.map(i => i.toString().padStart(2, ' '))
  return bet.join(' - ');
}

async function generateBets() {
  console.log('---------------------------------------');
  const gen = new Generator();
  for (let i = 1; i <= 10; i++) {
    const r = gen.generateBet();
    console.log(`Aposta ${i.toString().padStart(2, ' ')}: ${showBet(r)}`);
  }
  console.log('---------------------------------------');
  const rn = gen.generateRandomNumbers(10);
  console.log('---------------------------------------');
}

async function updateDataBase() {
  const db = new SqliteManipulation();

  db.updateConcursos();
}

async function main() {
  // Atualiza dados do banco com a API da Caixa
  await updateDataBase();
  // Gera apostas aleatórias
  await generateBets();
}

main();
