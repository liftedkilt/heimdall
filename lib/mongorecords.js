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
	return await Record.find({
		zoneId: zoneId,
	}).exec();
};

let updateRecordByRecordId = async function(record, oldId, newId) {
	console.log(record, oldId, newId);
	record.id = newId;
	try {
		await Record.findOneAndUpdate({
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
	updateRecordByRecordId: updateRecordByRecordId,
};
