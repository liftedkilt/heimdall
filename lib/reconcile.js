'use strict';

import CFRecords from './cloudflarerecords';
import MongoRecords from './mongorecords';
import Validate from './validate';
import lodash from 'lodash';

export const route = {
	method: 'patch',
	path: '/zones/:zone_identifier/sync',
	type: 'json',
};

let recreateRecord = async function(record) {
	// delete record.id
	// create new record in CF
	// update mongo Record with record ID from new record
	let tempRecord = record;
	// TODO: figure out why record loses record.id when tempRecord.id is deleted.
	let foo = record.id;
	delete tempRecord.id;

	let generatedRecord = await Cloudflare.DNSRecord.create(tempRecord);
	let newRecord = await cf.addDNS(generatedRecord);
	await MongoRecords.updateRecordByRecordId(record, foo, newRecord.id);
	return newRecord.id;
};

let reconcileRecords = function(cfRecords, mongoRecords) {
	let syncResults = {};
	syncResults.deleted = [];
	syncResults.added = [];
	syncResults.updated = [];

	let cfLoop = cfRecords.map((record) => {
		let mongoRecord = lodash.filter(mongoRecords, {id: record.id});
		if (mongoRecord == '' ) {
			syncResults.deleted.push(record);
			CFRecords.deleteRecord(record.zoneId, record.id);
		} else if (Validate.recordIsEqual(record, mongoRecord[0]) == false) {
			syncResults.updated.push(record);
			console.log(record);
			console.log(mongoRecord[0]);
			CFRecords.updateRecord(mongoRecord[0]);
		};
	});

	let mongoLoop = mongoRecords.map((record) => {
		let cfRecord = lodash.filter(cfRecords, {id: record.id});
		if (cfRecord == '' ) {
			syncResults.added.push(record);
			try {
				recreateRecord(record);
			} catch (error) {
				console.log(error);
			}
		};
	});

	return Promise.all([cfLoop, mongoLoop])
		.then(function (record) {
			return syncResults;
		});
};

export default async(req, res) => {
	log.info('RECONCILING zone: %s', req.params.zone_identifier);

	let zoneId = req.params.zone_identifier;
	let cfRecords = await CFRecords.cleanRecords(zoneId);
	let mongoRecords = await MongoRecords.cleanRecords(zoneId);
	let response = await reconcileRecords(cfRecords, mongoRecords);

	return response;
};
