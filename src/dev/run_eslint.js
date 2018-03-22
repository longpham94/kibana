'use strict';

var _options = require('eslint/lib/options');

var _default_eslint_paths = require('./default_eslint_paths');

const options = (0, _options.parse)(process.argv);

if (!options._.length && !options.printConfig) {
  process.argv.push(..._default_eslint_paths.DEFAULT_ESLINT_PATHS);
}

if (!process.argv.includes('--no-cache')) {
  process.argv.push('--cache');
}

// common-js is requires to that logic before this executes before loading eslint
require('eslint/bin/eslint');
