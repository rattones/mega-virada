const fs = require('fs');

// Read the JSON file
const megaSenaData = JSON.parse(fs.readFileSync('data/mega-sena.json', 'utf8'));

// Create a map to store combinations
const combinationMap = new Map();

// Process each draw
megaSenaData.forEach(draw => {
    // Get the numbers and sort them
    const numbers = [
        parseInt(draw.Bola1),
        parseInt(draw.Bola2),
        parseInt(draw.Bola3),
        parseInt(draw.Bola4),
        parseInt(draw.Bola5),
        parseInt(draw.Bola6)
    ].sort((a, b) => a - b);

    // Create a key from sorted numbers
    const combinationKey = numbers.join('-');

    // If combination exists, we found a match
    if (combinationMap.has(combinationKey)) {
        const previousDraw = combinationMap.get(combinationKey);
        console.log('Combinação repetida encontrada!');
        console.log(`Primeiro sorteio: Concurso ${previousDraw.Concurso} - Data: ${previousDraw['Data do Sorteio']}`);
        console.log(`Segundo sorteio: Concurso ${draw.Concurso} - Data: ${draw['Data do Sorteio']}`);
        console.log(`Números: ${numbers.join(', ')}`);
        console.log('-------------------');
    }

    // Store the combination
    combinationMap.set(combinationKey, draw);
});

console.log('Análise concluída!');
