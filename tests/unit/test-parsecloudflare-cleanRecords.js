'use strict';

let assert = require('assert');
let Validate = require('../../.magnet/server/lib/validate');

exports.it_should_return_a_cleaned_A_record = function(done) {
	let desiredResult = {
				'name': 'arecord.heimdall.xyz',
				'content': '127.0.0.1',
				'type': 'A',
				'proxied': false,
				'zoneId': '14qk4jgnqj4f5qu4f5nkqf5nk2qf3q5j',
				'zoneName': 'heimdall.xyz',
				'ttl': 1,
				'id': 'q4kjw5l7kjbwtkljqb45kj35g62j3kh6',
	};
	let record = {
				'id': 'q4kjw5l7kjbwtkljqb45kj35g62j3kh6',
				'type': 'A',
				'name': 'arecord.heimdall.xyz',
				'content': '127.0.0.1',
				'proxiable': false,
				'proxied': false,
				'ttl': 1,
				'locked': false,
				'zoneId': '14qk4jgnqj4f5qu4f5nkqf5nk2qf3q5j',
				'zoneName': 'heimdall.xyz',
				'createdOn': '2017-05-11T14:38:48.329Z',
				'modifiedOn': '2017-05-11T14:38:48.329Z',
				'priority': 0,
				'meta': {
					auto_added: false,
				},
			};
  let cleanRecord = Validate.cleanRecords(record);
  assert.deepEqual(cleanRecord, desiredResult);
  return done();
};

exports.it_should_return_a_cleaned_CNAME = function(done) {
	let desiredResult = {
				'name': 'cname.heimdall.xyz',
				'content': 'heimdall.xyz',
				'type': 'CNAME',
				'proxied': true,
				'zoneId': '34qk4jgnqj4d5qu4f5nkqf5nk2qf3q5x',
				'zoneName': 'heimdall.xyz',
				'ttl': 1,
				'id': 'b4kjw5l7kabwtkl2qb45kj35g62j3kh6',
	};
	let record = {
				'id': 'b4kjw5l7kabwtkl2qb45kj35g62j3kh6',
				'type': 'CNAME',
				'name': 'cname.heimdall.xyz',
				'content': 'heimdall.xyz',
				'proxiable': true,
				'proxied': true,
				'ttl': 1,
				'locked': false,
				'zoneId': '34qk4jgnqj4d5qu4f5nkqf5nk2qf3q5x',
				'zoneName': 'heimdall.xyz',
				'createdOn': '2017-05-11T14:38:48.329Z',
				'modifiedOn': '2017-05-11T14:38:48.329Z',
				'priority': 0,
				'meta': {
					auto_added: false,
				},
			};
  let cleanRecord = Validate.cleanRecords(record);
  assert.deepEqual(cleanRecord, desiredResult);
  return done();
};
