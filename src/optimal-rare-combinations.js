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

// Get 10 least frequent numbers
const bottom10Numbers = Array.from(numberFrequency.entries())
    .sort((a, b) => a[1] - b[1])
    .slice(0, 10)
    .map(([num]) => num);

// Get all existing combinations
const existingCombinations = new Set(
    megaSenaData.map(draw => {
        return [draw.Bola1, draw.Bola2, draw.Bola3, draw.Bola4, draw.Bola5, draw.Bola6]
            .map(n => parseInt(n))
            .sort((a, b) => a - b)
            .join('-');
    })
);

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

// Function to find best 8 numbers
function findBestEightNumbers(bottom10Numbers) {
    let bestCombination = null;
    let maxNewCombinations = 0;

    // Generate all possible combinations of 8 numbers from bottom 10
    const eightNumberSets = generateCombinations(bottom10Numbers, 8);

    eightNumberSets.forEach(eightNumbers => {
        const possibleCombinations = generateCombinations(eightNumbers, 6);
        const newCombinations = possibleCombinations.filter(combo =>
            !existingCombinations.has(combo.join('-'))
        );

        if (newCombinations.length > maxNewCombinations) {
            maxNewCombinations = newCombinations.length;
            bestCombination = {
                numbers: eightNumbers,
                combinations: newCombinations
            };
        }
    });

    return bestCombination;
}

const bestResult = findBestEightNumbers(bottom10Numbers);

console.log('Os 10 números menos sorteados:');
console.log(bottom10Numbers.join(', '));

console.log('\nOs 8 números selecionados que geram mais combinações novas:');
console.log(bestResult.numbers.join(', '));

console.log('\nNúmero total de novas combinações possíveis:', bestResult.combinations.length);

console.log('\nPrimeiras 10 combinações sugeridas:');
bestResult.combinations.slice(0, 10).forEach((combo, index) => {
    console.log(`Combinação ${index + 1}: ${combo.join(', ')}`);
});
