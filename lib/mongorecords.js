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

let searchRecords = async function(zoneId, data) {
	let search = data;
	data.zoneId = zoneId;

	if (data.hasOwnProperty('name')) {
		search.name = new RegExp(data.name, 'i');
	}
	if (data.hasOwnProperty('content')) {
		search.content = new RegExp(data.content, 'i');
	}

	console.log(data);
	return await Records.find(
		search
	).exec();
};

let updateRecordByRecordId = async function(record, oldId, newId) {
	console.log(record, oldId, newId);
	record.id = newId;
	try {
		await Records.findOneAndUpdate({
					id: oldId,
					zoneId: record.zoneId,
				},
				record, {
					new: true,
				});
		log.info('record updated in MongoDB');
	} catch (error) {
		res.status(500).json({
			result: 'error',
			message: 'Cannot update record',
			info: {
				error: error,
			},
		});
	}
};

module.exports = {
	cleanRecords: cleanRecords,
	getRecords: getRecords,
	searchRecords: searchRecords,
	updateRecordByRecordId: updateRecordByRecordId,
};
