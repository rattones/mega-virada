const FileManipulation = require('./file-manipulation.js');

const fm = new FileManipulation();

// console.log('analizer', fm.getData('1432'));
console.log('analizer', fm.getData(2810));

fm.writeData(fm.getData('100'));
