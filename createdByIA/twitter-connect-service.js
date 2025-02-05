const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const Generator = require('../src/generator.js');
const SqliteManipulation = require('../src/sqlite-manipulation.js');

// Twitter client configuration
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});
function showBet(bet) {
  bet = bet.map(i => i.toString().padStart(2, ' '))
  return bet.join(' - ');
}

async function tweetBet(betString) {
  try {
    await twitterClient.v2.tweet(`Mega da Virada - Sugestão de aposta:\n${betString}`);
    console.log('Tweet posted successfully!');
  } catch (error) {
    console.log('Error posting tweet:', error);
  }
}

async function generateBets() {
  console.log('---------------------------------------');
  const gen = new Generator();
  for (let i = 1; i <= 10; i++) {
    const r = gen.generateBet();
    const betString = `Aposta ${i.toString().padStart(2, ' ')}: ${showBet(r)}`;
    console.log(betString);
    await tweetBet(betString);
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
  await updateDataBase();
  await generateBets();
}

main();
