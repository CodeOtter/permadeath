var comparison = require('./comparison');
var del = require('./utils').del

/**
 * [exports description]
 * @param  {[type]} processPath [description]
 * @return {[type]}             [description]
 */
module.exports = function permadeath (processPath, opts) {
  // for now support one file, but we need to figure out how to
  // aggregate these forks, etc.
  processPath = processPath[0]
  var fork = require('child_process').fork;

  try {
    var child = fork(processPath);
  } catch (e) {
    console.log('punishment caught!');
    process.exit(1);
  }

  function exitHandler (reason, error) {
    console.log(reason);
    if (!opts.dry) {
      del([processPath], function (err) {
        if (err) {
          process.exit(err)
        } else {
          console.log(`Deleted ${processPath}!`)
          process.exit(error)
        }
      })
    }
    if (typeof error === 'number' && error !== 0) {
      console.log('non-zero termination!');
    } else if (error) {
      console.log('error stack detected!');
      console.dir(error.stack);
    }
  }

  child.on('exit', exitHandler.bind(null, 'exit'));
  child.on('SIGINT', exitHandler.bind(null, 'SIGINT'));
  child.on('uncaughtException', exitHandler.bind(null, 'uncaughtException'));
  child.on('unhandledRejection', exitHandler.bind(null, 'unhandledRejection'));

  comparison(processPath);
};
