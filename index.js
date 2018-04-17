const fs = require('fs');

function consoleError() {
  if (!arguments.length) {
    return;
  }
  let msg = '';
  for (let ii = 0; ii < arguments.length; ii++) {
    msg += JSON.stringify(arguments[ii], null, 4) + ',';
  }
  if (fs.existsSync('~/log.txt')) {
    fs.appendFileSync('~/log.txt', msg);
  } else {
    fs.writeFileSync('~/log.txt', msg);
  }
  fs.appendFileSync('~/log.txt', '**********************');
}

module.exports =  (t) => {
  let foundFile = false;
  let didHandle = false;

  return {
    name: 'env-checker',

    pre (file) {
      if (foundFile) {
        // return;
      }
      const filename = file.opts.filename;
      const filenameRelative = file.opts.filenameRelative;
      throw new Error('fuck' + filename);
      consoleError('*****************************************************************');
      consoleError('*****************************************************************');
      consoleError('*****************************************************************');
      consoleError('*****************************************************************');
      consoleError('*****************************************************************');
      consoleError('*****************************************************************');
      consoleError('\n\n\n\n\nfilename, filenameRelative: ', filename, filenameRelative);
      consoleError('\n\n\n\n');
      consoleError('*****************************************************************');
      consoleError('*****************************************************************');
      consoleError('*****************************************************************');
      consoleError('*****************************************************************');
      consoleError('*****************************************************************');
      consoleError('*****************************************************************');
      foundFile = /Config/.test(filename || '');
    },

    visitor: {
      Program (path, state) {
        throw new Error('fuck' + filename);
        if (didHandle) {
          return;
        }
        if (!foundFile) {
          return;
        }
        consoleError('*****************************************************************');
        consoleError('*****************************************************************');
        consoleError('option: ', state);
        consoleError('*****************************************************************');
        consoleError('*****************************************************************');
      },
    },
  };
};
