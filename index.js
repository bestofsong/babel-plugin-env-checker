const fs = require('fs');

const HOME = `${process.env.HOME}/log.txt`;

function consoleError() {
  if (!arguments.length) {
    return;
  }
  let msg = '';
  for (let ii = 0; ii < arguments.length; ii++) {
    console.error(arguments[ii]);
    msg += arguments[ii] + ',';
  }
  if (fs.existsSync(HOME)) {
    fs.appendFileSync(HOME, msg);
  } else {
    fs.writeFileSync(HOME, msg);
  }
  fs.appendFileSync(HOME, '**********************');
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
        consoleError('*****************************************************************');
        consoleError('*****************************************************************');
        consoleError('option: ', state.opts);
        consoleError('*****************************************************************');
        consoleError('*****************************************************************');
        if (didHandle) {
          return;
        }
        if (!foundFile) {
          return;
        }
      },
    },
  };
};
