const fs = require('fs');
const { parse } = require('csv-parse');

const results = [];

fs.createReadStream('numeros-mega-sena.csv')
  .pipe(parse({
    delimiter: ',',
    columns: true,
    skip_empty_lines: true
  }))
  .on('data', (data) => {
    results.push(data);
  })
  .on('end', () => {
    fs.writeFileSync('data/mega-sena.json', JSON.stringify(results, null, 2));
    console.log('Conversão concluída! Arquivo mega-sena.json foi criado.');
  });
