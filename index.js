const path = require('path');

const Generator = require('./src/generator.js');

function showBet(bet) {
  bet = bet.map(i => i.toString().padStart(2, ' '))
  return bet.join(' - ');
}

async function teste() {
  const gen = new Generator();
  // for (let i = 1; i <= 10; i++) {
  //   const r = gen.generateBet();
  //   console.log(`Aposta ${i.toString().padStart(2, ' ')}: ${showBet(r)}`);
  // }
  const rn = gen.generateRandomNumbers(20);
  console.log(`Aposta: ${showBet(rn)}`);
}
teste();
