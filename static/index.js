const fs = require("fs");
const join = require("path").join;
const mockPath = join(__dirname + "/api");
/**
 *
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
function findSync(startPath) {
  let result = [];
  function finder(path) {
    let files = fs.readdirSync(path);
    files.forEach((val, index) => {
      let fPath = join(path, val);
      let stats = fs.statSync(fPath);
      if (stats.isDirectory()) finder(fPath);
      if (stats.isFile()) result.push(fPath);
    });
  }
  finder(startPath);
  return result;
}

const mock = {};

findSync(mockPath).forEach(file => {
  Object.assign(mock, require(file));
});

module.exports = mock;
