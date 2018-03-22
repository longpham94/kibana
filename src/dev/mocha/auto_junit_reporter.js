'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAutoJunitReporter = createAutoJunitReporter;

var _mocha = require('mocha');

var _mocha2 = _interopRequireDefault(_mocha);

var _junit_report_generation = require('./junit_report_generation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MochaSpecReporter = _mocha2.default.reporters.spec;

function createAutoJunitReporter(junitReportOptions) {
  return class createAutoJunitReporter {
    constructor(runner, options) {
      // setup a spec reporter for console output
      new MochaSpecReporter(runner, options);

      // in CI we also setup the Junit reporter
      if (process.env.CI) {
        (0, _junit_report_generation.setupJunitReportGeneration)(runner, junitReportOptions);
      }
    }
  };
}
