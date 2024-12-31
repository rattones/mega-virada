const fs = require('fs');

// Read the JSON file
const megaSenaData = JSON.parse(fs.readFileSync('data/mega-sena.json', 'utf8'));

// Count frequency of each number
const numberFrequency = new Map();
for (let i = 1; i <= 60; i++) {
    numberFrequency.set(i, 0);
}

// Count occurrences
megaSenaData.forEach(draw => {
    [draw.Bola1, draw.Bola2, draw.Bola3, draw.Bola4, draw.Bola5, draw.Bola6]
        .forEach(num => numberFrequency.set(parseInt(num), numberFrequency.get(parseInt(num)) + 1));
});

// Calculate average frequency
const frequencies = Array.from(numberFrequency.values());
const averageFrequency = frequencies.reduce((a, b) => a + b) / frequencies.length;

// Get numbers closest to average frequency (10 numbers around the mean)
const numbersWithFrequency = Array.from(numberFrequency.entries())
    .map(([num, freq]) => ({
        number: num,
        frequency: freq,
        distanceFromAverage: Math.abs(freq - averageFrequency)
    }))
    .sort((a, b) => a.distanceFromAverage - b.distanceFromAverage)
    .slice(0, 10);

console.log('Os 10 números com frequência mais próxima da média:');
console.log(`Frequência média: ${averageFrequency.toFixed(2)} vezes`);
numbersWithFrequency.forEach(({number, frequency}) => {
    console.log(`Número ${number}: ${frequency} vezes`);
});

// Function to generate combinations
function generateCombinations(numbers, size) {
    const combinations = [];

    function backtrack(start, current) {
        if (current.length === size) {
            combinations.push([...current].sort((a, b) => a - b));
            return;
        }

        for (let i = start; i < numbers.length; i++) {
            current.push(numbers[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }

    backtrack(0, []);
    return combinations;
}

// Get all existing combinations
const existingCombinations = new Set(
    megaSenaData.map(draw => {
        return [draw.Bola1, draw.Bola2, draw.Bola3, draw.Bola4, draw.Bola5, draw.Bola6]
            .map(n => parseInt(n))
            .sort((a, b) => a - b)
            .join('-');
    })
);

// Generate new combinations from average frequency numbers
const averageFrequencyNumbers = numbersWithFrequency.map(item => item.number);
const newCombinations = generateCombinations(averageFrequencyNumbers, 6)
    .filter(combo => !existingCombinations.has(combo.join('-')))
    .slice(0, 10);

console.log('\nSugestões de novas combinações com os números de frequência média:');
newCombinations.forEach((combo, index) => {
    console.log(`Combinação ${index + 1}: ${combo.join(', ')}`);
});
