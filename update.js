const SqliteManipulation = require('./src/sqlite-manipulation.js');

async function updateDataBase() {
  const db = new SqliteManipulation();

  db.updateConcursos();
}

updateDataBase();
