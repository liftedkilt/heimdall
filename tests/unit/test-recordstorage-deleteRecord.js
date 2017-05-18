'use strict';

let assert = require('assert');
let Remap = require('../../.magnet/server/lib/remap');

exports.it_should_return_an_ID_and_zoneId = function(done) {
	let req = {
				params: {
					zone_identifier: '235k6jh34lk6g124kjg51lk4g512lk4g',
					identifier: '12lk4j51lk24jg512klj51l2kj12klj5',
				},
			};

	let desiredResult = {
		id: '12lk4j51lk24jg512klj51l2kj12klj5',
		zoneId: '235k6jh34lk6g124kjg51lk4g512lk4g',
	};

	assert.deepEqual(Remap.reqParams(req), desiredResult);
	return done();
};
