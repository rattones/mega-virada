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

// Get top 10 most frequent numbers
const topNumbers = Array.from(numberFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

console.log('Os 10 números mais sorteados:');
topNumbers.forEach(([num, freq]) => {
    console.log(`Número ${num}: ${freq} vezes`);
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

// Generate new combinations from top 10 numbers
const topNumbersValues = topNumbers.map(([num]) => num);
const newCombinations = generateCombinations(topNumbersValues, 6)
    .filter(combo => !existingCombinations.has(combo.join('-')))
    .slice(0, 10);

console.log('\nSugestões de novas combinações com os números mais frequentes:');
newCombinations.forEach((combo, index) => {
    console.log(`Combinação ${index + 1}: ${combo.join(', ')}`);
});
