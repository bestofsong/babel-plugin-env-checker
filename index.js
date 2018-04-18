const _ = require('lodash');
const fs = require('fs');
const P = require('path');

const CWD_ALSO_ASSUMED_TO_BE_PROJECT_ROOT = process.cwd();


const CONSTRAINT_VISITORS = {
  enum (constraint, node, t) {
    const name = _.get(node, 'declaration.declarations.0.id.name');
    const init = _.get(node, 'declaration.declarations.0.init');
    // fixme: currently only support string literal
    const value = init.value;

    if (!t.isStringLiteral(init)) {
      throw new Error(`ExportNamedDeclaration ${name} has exported none string literal(${JSON.stringify(init)}), not supported or some kind of error`);
    }

    if (_.get(constraint, 'value.type') !== 'enum') {
      console.error('not implemented yet');
    }
    const values = _.get(constraint, 'value.values');
    const ok = values.some(v => v === value);
    if (!ok) {
      throw new Error(`ExportNamedDeclaration ${name} has invalid value: ${value}, should be one of: ${JSON.stringify(values)}`);
    }
  },
};


function getFileConstraints(currentFile, opts) {
  if (!P.isAbsolute(currentFile)) {
    currentFile = P.join(CWD_ALSO_ASSUMED_TO_BE_PROJECT_ROOT, currentFile);
  }
  currentFile = P.normalize(currentFile);
  const { fileConstraints = [] } = opts || {};
  return fileConstraints.find((it) => {
    const fullname = P.normalize(P.join(CWD_ALSO_ASSUMED_TO_BE_PROJECT_ROOT, it.file));
    return fullname === currentFile;
  });
}


module.exports =  ({ types: t }) => {
  let currentFile = '';
  let didHandle = false;

  return {
    name: 'env-checker',
    pre (file) {
      currentFile = file.opts.filename;
    },
    post () {
      currentFile = '';
    },
    visitor: {
      ExportNamedDeclaration: {
        exit(path, state) {
          const fileConstraints = getFileConstraints(currentFile, state.opts);
          if (!fileConstraints) {
            return;
          }

          const node = path.node;
          const declaration = _.get(node, 'declaration');
          if (!t.isVariableDeclaration(declaration)) {
            // fixme: what about other kind of declaration
            return;
          }

          const constraints = fileConstraints.constraints;
          constraints.forEach((constraint) => {
            if (constraint.type !== 'export') {
              throw new Error(`Constraint type: ${constraint.type} not supported yet.`);
            }

            const declarator = _.get(node, 'declaration.declarations.0');
            const name = _.get(node, 'declaration.declarations.0.id.name');
            if (constraint.name !== name) {
              return;
            }

            const visitor = CONSTRAINT_VISITORS[constraint.value.type];
            if (!visitor) {
              throw new Error(`不支持的export变量类型，目前仅支持：${JSON.stringify(Object.keys(CONSTRAINT_VISITORS))}`);
            }

            visitor(constraint, node, t);
          });
        },
      },
    },
  };
};
