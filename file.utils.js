const fs = require('fs');

const fileUtils = module.exports = {
  forEachFile(folderPath, callback) {
    fs.readdirSync(folderPath)
      .forEach(file => {
        if (fs.statSync(folderPath + '/' + file).isDirectory()) {
          fileUtils.forEachFile(folderPath + '/' + file, callback);
        } else {
          callback(folderPath + '/' + file);
        }
      });
  }
};
 