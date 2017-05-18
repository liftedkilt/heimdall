'use strict';

import Validate from './validate';

let cleanRecords = async function(zoneId) {
	let mongoRecords = await getRecords(zoneId);
	let mongoRecordsClean = [];

	mongoRecords.forEach(async function(record) {
		mongoRecordsClean.push(await Validate.cleanRecords(record));
	});

	return mongoRecordsClean;
};

let getRecords = async function(zoneId) {
	return await Records.find({
		zoneId: zoneId,
	}).exec();
};

module.exports = {
	cleanRecords: cleanRecords,
	getRecords: getRecords,
};
