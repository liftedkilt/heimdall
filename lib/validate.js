'use strict';

import assert from 'assert';

let cleanRecords = function(entry) {
	return {
		'name': entry.name,
		'content': entry.content,
		'type': entry.type,
		'proxied': entry.proxied,
		'zoneId': entry.zoneId,
		'zoneName': entry.zoneName,
		'ttl': entry.ttl,
		'id': entry.id,
	};
};

let recordIsEqual = function(a, b) {
	try {
		assert.deepEqual(a, b);
	} catch (error) {
		if (error.name === 'AssertionError') {
			return false;
		}
		throw error;
	}
	return true;
};

let reqParams = function(req, message) {
	if (!req.body.hasOwnProperty('content')
	|| !req.body.hasOwnProperty('name')
	|| !req.body.hasOwnProperty('type')) {
		log.info('received request with missing parameters');
		return({
			result: 'error',
			message: message,
			info: {
				type: req.body.type || '{MISSING}',
				name: req.body.name || '{MISSING}',
				content: req.body.content || '{MISSING}',
			},
		});
	} else {
		return '';
	}
};

module.exports = {
	reqParams: reqParams,
	cleanRecords: cleanRecords,
	recordIsEqual: recordIsEqual,
};
