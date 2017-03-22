/**
 * [exports description]
 * @param  {[type]} processPath [description]
 * @return {[type]}             [description]
 */
module.exports = function permadeath (processPath) {
  var fork = require('child_process').fork;

  try {
    var child = fork(processPath);
  } catch (e) {
    console.log('punishment caught!');
    process.exit(1);
  }

  function exitHandler (reason, err) {
    console.log(reason);
    if (typeof err === 'number' && err !== 0) {
      console.log('non-zero termination!');
      process.exit(err);
    } else if (err) {
      console.log('error stack detected!');
      console.dir(err.stack);
      process.exit(1);
    }
  }

  child.on('exit', exitHandler.bind(null, 'exit'));
  child.on('SIGINT', exitHandler.bind(null, 'SIGINT'));
  child.on('uncaughtException', exitHandler.bind(null, 'uncaughtException'));
  child.on('unhandledRejection', exitHandler.bind(null, 'unhandledRejection'));
};
