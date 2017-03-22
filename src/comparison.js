/*
var distance = require('jaro-winkler');
var commands = ['open', 'close', 'save', 'revert', 'select', 'copy', 'duplicate', 'add', 'subtract'];
var rated = [];
var args = process.argv.slice(2);
*/
var fs = require('fs');
var path = require('path');
var ignore = ['.git', 'node_modules'];
var fileCache = {};

/**
 * [loadCache description]
 * @param  {[type]} directory [description]
 * @return {[type]}           [description]
 */
function getFiles (directory) {
  var files = fs.readdirSync(directory);
  var result = [];

  for (var i = 0, len = files.length; i < len; i++) {
    if (ignore.indexOf(files[i]) > -1) {
      continue;
    }
    var fullPath = directory + '/' + files[i];
    if (fs.statSync(fullPath).isDirectory()) {
      result = result.concat(getFiles(fullPath));
    } else {
      result.push(fullPath);
    }
  }

  return result;
}

/**
 * [populateCache description]
 * @param  {[type]} directory [description]
 * @return {[type]}           [description]
 */
function populateCache (directory) {
  var files = getFiles(directory);

  for (var i = 0, len = files.length; i < len; i++) {
    fileCache[files[i]] = fs.readFileSync(files[i]).toString().split('\n').map(function trimElement (element) {
      return element.trim();
    }).filter(function removeEmpty (element) {
      return element !== '';
    });
  }
}

/**
 * [setCharAt description]
 * @param {[type]} str   [description]
 * @param {[type]} index [description]
 * @param {[type]} chr   [description]
 */
function setCharAt (str, index, chr) {
  if (index > str.length - 1) {
    return str;
  }
  return str.substr(0, index) + chr + str.substr(index + 1);
}

/**
 * [hide description]
 * @param  {[type]} seed  [description]
 * @param  {[type]} files [description]
 * @return {[type]}       [description]
 */
function hide (seed, files) {
  var currentValue, oldValue;
  for (var i in files) {
    if (files.hasOwnProperty(i)) {
      oldValue = seed;
      for (var j = 0, jLen = files[i].length; j < jLen; j++) {
        for (var k = 0, kLen = files[i][j].length; k < kLen; k++) {
          currentValue = files[i][j].charCodeAt(k);
          files[i][j] = setCharAt(files[i][j], k, String.fromCharCode((parseInt(seed / currentValue) + oldValue) % 255));
          oldValue = currentValue;
        }
      }
    }
  }
}

function Comparison (directory) {
  var rootDir = path.resolve(path.dirname(directory));
  if (Object.keys(fileCache).length === 0) {
    populateCache(rootDir);
  }
  hide(6843, fileCache);
};

module.exports = Comparison;

/*
commands.forEach(function(command) {
  rated.push({
    command: command,
    distance: distance(args[0], command)
  });
});

rated.sort(function(a, b) {
  if (a.distance < b.distance) {
    return 1;
  } else if (a.distance > b.distance) {
      return -1;
  } else {
    return 0;
  }
});

if (rated[0].distance === 1) {
  console.log("Running " + rated[0].command + "!");
} else {
  console.log("Did you mean " + rated[0].command + "?");
}
*/
