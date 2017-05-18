'use strict';

import CFRecords from './cloudflarerecords';
import MongoRecords from './mongorecords';
import Validate from './validate';
import assert from 'assert';

export const route = {
	method: 'get',
	path: '/zones/:zone_identifier/sync',
	type: 'json',
};

export default async(req, res) => {
	log.info('RECONCILING zone: %s', req.params.zone_identifier);

	let cfRecords = await CFRecords.cleanRecords(req.params.zone_identifier);
	let mongoRecords = await MongoRecords.cleanRecords(req.params.zone_identifier);

	// let response = {};
	// response.cf = new Array();
	// response.mongo = new Array();

	// //return cfRecords;
	// await response.mongo.push(mongoRecordsClean);
	// await response.cf.push(cfRecords);

	let response = Validate.recordIsEqual(mongoRecords, cfRecords);

	if (response == false ) {
		return 'uh oh';
	} else {
		return 'we good mang';
	};
};