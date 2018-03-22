'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _fs = require('fs');

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _xmlbuilder = require('xmlbuilder');

var _xmlbuilder2 = _interopRequireDefault(_xmlbuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ROOT_DIR = (0, _path.dirname)(require.resolve('../../../package.json'));

/**
 * Jest reporter that produces JUnit report when running on CI
 * @class JestJunitReporter
 */
class JestJunitReporter {
  constructor(globalConfig, options = {}) {
    var _options$reportName = options.reportName;
    const reportName = _options$reportName === undefined ? 'Jest Tests' : _options$reportName;
    var _options$rootDirector = options.rootDirectory;
    const rootDirectory = _options$rootDirector === undefined ? ROOT_DIR : _options$rootDirector;


    this._reportName = reportName;
    this._rootDirectory = rootDirectory;
  }

  /**
   * Called by jest when all tests complete
   * @param {Object} contexts
   * @param {JestResults} results see https://facebook.github.io/jest/docs/en/configuration.html#testresultsprocessor-string
   * @return {undefined}
   */
  onRunComplete(contexts, results) {
    if (!process.env.CI) {
      return;
    }

    const reportName = this._reportName;
    const rootDirectory = this._rootDirectory;
    const root = _xmlbuilder2.default.create('testsuites', { encoding: 'utf-8' }, {}, { skipNullAttributes: true });

    const msToIso = ms => ms ? new Date(ms).toISOString().slice(0, -5) : undefined;
    const msToSec = ms => ms ? (ms / 1000).toFixed(3) : undefined;

    root.att({
      name: 'jest',
      timestamp: msToIso(results.startTime),
      time: msToSec(Date.now() - results.startTime),
      tests: results.numTotalTests,
      failures: results.numFailedTests,
      skipped: results.numPendingTests
    });

    // top level test results are the files/suites
    results.testResults.forEach(suite => {
      const suiteEl = root.ele('testsuite', {
        name: (0, _path.relative)(rootDirectory, suite.testFilePath),
        timestamp: msToIso(suite.perfStats.start),
        time: msToSec(suite.perfStats.end - suite.perfStats.start),
        tests: suite.testResults.length,
        failures: suite.numFailedTests,
        skipped: suite.numPendingTests,
        file: suite.testFilePath
      });

      // nested in there are the tests in that file
      const relativePath = (0, _path.dirname)((0, _path.relative)(rootDirectory, suite.testFilePath));
      const classname = `${reportName}.${relativePath.replace(/\./g, '·')}`;
      suite.testResults.forEach(test => {
        const testEl = suiteEl.ele('testcase', {
          classname,
          name: [...test.ancestorTitles, test.title].join(' '),
          time: msToSec(test.duration)
        });

        test.failureMessages.forEach(message => {
          testEl.ele('failure').dat(message);
        });

        if (test.status === 'pending') {
          testEl.ele('skipped');
        }
      });
    });

    const reportPath = (0, _path.resolve)(rootDirectory, `target/junit/${reportName}.xml`);
    const reportXML = root.end({
      pretty: true,
      indent: '  ',
      newline: '\n',
      spacebeforeslash: ''
    });

    _mkdirp2.default.sync((0, _path.dirname)(reportPath));
    (0, _fs.writeFileSync)(reportPath, reportXML, 'utf8');
  }
}
exports.default = JestJunitReporter;
module.exports = exports['default'];
