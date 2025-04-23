const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const Generator = require('../src/generator.js');
const SqliteManipulation = require('../src/sqlite-manipulation.js');

// Twitter client configuration
const clientOA1 = new TwitterApi({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    bearerToken: process.env.TWITTER_BEARER_TOKEN,
});

const clientOA2 = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
})

function showBet(bet) {
  bet = bet.map(i => i.toString().padStart(2, ' '))
  return bet.join(' - ');
}

async function tweetBet(betString) {
  try {
    await clientOA2.v2.tweet(`Mega da Virada - Sugestão de aposta:\n${betString}`);
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

async function getDM() {
  const eventTimeline = await clientOA1.v2.listDmEvents() // error 401 unauthorized
  console.log(eventTimeline.events)
}

async function getMentions() {
  // const tweetsOfJack = await client.v2.userMentionTimeline('34467533', { end_time: '2025-02-05T00:00:00' }); // error 429 too many requests
  const mentionTimeline = await clientOA2.v1.mentionTimeline({ trim_user: true }); // error 453 access level
  const fetchedTweets = mentionTimeline.tweets;
  console.log('getMentions', fetchedTweets);
}

async function main() {
  await updateDataBase();
  await generateBets();
  await getDM();
  await getMentions();
}

// main();
getDM();
// getMentions();
