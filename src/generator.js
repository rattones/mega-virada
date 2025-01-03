const SqliteManipulation = require('./sqlite-manipulation.js');

module.exports = class Generator {
  // Instância do serviço que manipula o banco de dados
  db = new SqliteManipulation();

  /**
   * Gera número aleatório não repetido
   * @param {Array} array
   * @returns
   */
  newRandomNumber(array) {
    const newNumber = Math.floor(Math.random() * 60) + 1;
    if (array.includes(newNumber)) {
      return this.newRandomNumber(array);
    }
    return newNumber;
  }

  /**
   * Gera aposta aleatória com 6 números ainda não sorteados
   * @returns {Array} Array com números sorteados
   */
  generateBet() {
    const bet = [];
    let hashBet = '';
    // Gera números aleatórios
    for (let i = 0; i < 6; i++) {
      bet.push(this.newRandomNumber(bet));
    }
    // Ordena números
    bet.sort((a, b) => a - b);
    // Verifica se números já foram sorteados
    hashBet = this.db.getHashSorteio(bet);
    if (!this.db.getConcursoByHash(hashBet)) {
      // Se já foram sorteados, gera outra aposta
      console.log(`Aposta repetida. Gerando nova aposta...`);
      return this.generateBet();
    }
    return bet;
  }

  /**
   * Gera aposta aleatória com 6 ou mais números ainda não sorteados
   * @param {Integer} qtdNumbers
   * @returns
   */
  generateRandomNumbers(qtdNumbers) {
    qtdNumbers = (qtdNumbers > 6)? qtdNumbers : 6;
    const numbers = [];
    for (let i = 0; i < qtdNumbers; i++) {
      numbers.push(this.newRandomNumber(numbers));
    }
    numbers.sort((a, b) => a - b);

    const combinations = this.generateCombinations(numbers, 6);
    combinations.forEach(combination => {
      let hash = this.db.getHashSorteio(combination);
      if (!this.db.getConcursoByHash(hash)) {
        console.log(`Aposta repetida. Gerando novos números...`);
        return this.generateRandomNumbers(qtdNumbers);
      }
    });
    console.log(`Números: ${numbers}`);
    console.log(`Total de combinações: ${combinations.length}`);
    return numbers;
  }


  /**
   * Gera todas as combinações possíveis de um conjunto de números
   * @param {Array<number>} numbers - Array of numbers to generate combinations from
   * @param {number} size - Size of each combination
   * @returns {Array<Array<number>>} Array containing all possible combinations of the specified size
   */
  generateCombinations(numbers, size) {
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

}

