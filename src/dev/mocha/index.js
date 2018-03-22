'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auto_junit_reporter = require('./auto_junit_reporter');

Object.defineProperty(exports, 'createAutoJunitReporter', {
  enumerable: true,
  get: function get() {
    return _auto_junit_reporter.createAutoJunitReporter;
  }
});

var _junit_report_generation = require('./junit_report_generation');

Object.defineProperty(exports, 'setupJunitReportGeneration', {
  enumerable: true,
  get: function get() {
    return _junit_report_generation.setupJunitReportGeneration;
  }
});
