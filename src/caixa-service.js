// URL da API oficial da Caixa para consulta de resultados da Mega-Sena
const msUrl = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena';

module.exports = class CaixaService {
  // Objeto que armazena os dados do resultado da Mega-Sena
  mega = {
    "Concurso": null,
    "Data do Sorteio": null,
    "Bola1": null,
    "Bola2": null,
    "Bola3": null,
    "Bola4": null,
    "Bola5": null,
    "Bola6": null,
    "Ganhadores 6 acertos": "",
    "Cidade / UF": "",
    "Rateio 6 acertos": "",
    "Ganhadores 5 acertos": "",
    "Rateio 5 acertos": "",
    "Ganhadores 4 acertos": "",
    "Rateio 4 acertos": "",
    "Acumulado 6 acertos": "",
    "Arrecadação Total": "",
    "Estimativa prêmio": "",
    "Acumulado Sorteio Especial Mega da Virada": "",
    "Observação": ""
  }

  response = null;

  /**
   * Método para buscar dados da API da Caixa
   * @param {number} concurso - número do concurso (opcional)
   * @returns {Promise<Object>} Dados do sorteio processados
   */
  async getConcurso(concurso = null) {
    if (concurso != null) {
      msUrl= `${msUrl}/${concurso}`;
    }
    console.log('Buscando dados da API da Caixa');
    const response = await fetch(msUrl);
    const jsonResponse = await response.json();
    return await this.processData(jsonResponse);
  }

  /**
   * Processa os dados recebidos da API e formata para o padrão do objeto mega
   * @param {Object} data - Dados brutos da API
   * @returns {Object} Dados formatados no padrão do objeto mega
   */
  processData(data) {
    // Preenche números sorteados
    this.mega['Concurso'] = data.numero.toString();
    this.mega['Data do Sorteio'] = this.toFormat(data.dataApuracao).toString();
    this.mega['Bola1'] = parseInt(data.listaDezenas[0]).toString();
    this.mega['Bola2'] = parseInt(data.listaDezenas[1]).toString();
    this.mega['Bola3'] = parseInt(data.listaDezenas[2]).toString();
    this.mega['Bola4'] = parseInt(data.listaDezenas[3]).toString();
    this.mega['Bola5'] = parseInt(data.listaDezenas[4]).toString();
    this.mega['Bola6'] = parseInt(data.listaDezenas[5]).toString();
    // Preenche informações sobre ganhadores e prêmios
    this.mega['Ganhadores 6 acertos'] = data.listaRateioPremio[0].numeroDeGanhadores.toString();
    if (data.listaRateioPremio[0].numeroDeGanhadores > 0) {
      this.mega['Cidade / UF'] = this.getUFs(data).toString();
      this.mega['Rateio 6 acertos'] = this.toCurrency(data.listaRateioPremio[0].valorPremio).toString();
    }
    this.mega['Ganhadores 5 acertos'] = data.listaRateioPremio[1].numeroDeGanhadores.toString();
    this.mega['Rateio 5 acertos'] = this.toCurrency(data.listaRateioPremio[1].valorPremio).toString();
    this.mega['Ganhadores 4 acertos'] = data.listaRateioPremio[2].numeroDeGanhadores.toString();
    this.mega['Rateio 4 acertos'] = this.toCurrency(data.listaRateioPremio[2].valorPremio).toString();
    // Preenche valores de arrecadação e estimativas
    this.mega['Arrecadação Total'] = this.toCurrency(data.valorArrecadado).toString();
    this.mega['Estimativa prêmio'] = this.toCurrency(data.valorEstimadoProximoConcurso).toString();
    this.mega['Acumulado Sorteio Especial Mega da Virada'] = this.toCurrency(data.valorEstimadoProximoConcurso).toString();
    this.mega['Observação'] = data.observacao.toString();

    return this.mega;
  }

  // ======================= UTILS ======================= //

  /**
   * Converte data do formato DD/MM/YYYY para YYYY-MM-DD
   * @param {string} dt - Data no formato DD/MM/YYYY
   * @returns {string} Data no formato YYYY-MM-DD
   */
  toFormat(dt) {
    const aux = dt.split('/');
    return `${aux[2]}-${aux[1]}-${aux[0]}`;
  }

  /**
   * Extrai e retorna lista de UFs onde houve ganhadores
   * @param {Object} data - Dados do sorteio
   * @returns {string} Lista de UFs concatenada
   */
  getUFs(data) {
    let result = [];
    data.listaMunicipioUFGanhadores.forEach(item => {
      result.forEach(rItem => {
        if (rItem != item.uf) {
          result.push(item.uf);
        }
      })
    });

    return result.toString();
  }

  /**
   * Formata valores monetários no padrão brasileiro (R$)
   * @param {number} value - Valor a ser formatado
   * @returns {string} Valor formatado em moeda brasileira
   */
  toCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL' }).format(value);
  }

}
