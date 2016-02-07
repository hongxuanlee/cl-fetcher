'use strict';

/**
 * [LOG_LEVEL description]
 * @type {Number}
 * 0: off
 * 1: debug
 * 2: info
 * 3: warn
 * 4: error 
 */
var LOG_LEVEL = 1;

var log = {};

log.debug = function (text) {
	if (LOG_LEVEL === 1) {
		console.log('[DEBUG] ' + text);
	}
};

log.info = function (text) {
	if (LOG_LEVEL === 1 || LOG_LEVEL === 2) {
		console.log('[INFO]' + text);
	}
};

log.warn = function (text) {
	if (LOG_LEVEL === 1 || LOG_LEVEL === 2 || LOG_LEVEL === 3) {
		console.log('[WARN]' + text);
	}
};

log.error = function (text) {
	if (LOG_LEVEL === 1 || LOG_LEVEL === 2 || LOG_LEVEL === 3 || LOG_LEVEL === 4) {
		console.log('[ERROR]' + text);
	}
};

module.exports = log;