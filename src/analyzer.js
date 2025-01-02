const FileManipulation = require('./file-manipulation.js');

const fm = new FileManipulation();

module.exports = class Analyzer {
  megaSenaData = null;

  constructor() {
    this.megaSenaData = fm.getData();
  }
}
