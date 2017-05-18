'use strict';

import Validate from '../lib/validate';
import CFRecords from '../lib/cloudflarerecords';

export const route = {
	method: 'patch',
	path: '/zones/:zone_identifier/init',
	type: 'json',
};

export default async(req, res) => {
	log.info('INITIALIZING zone: %s', req.params.zone_identifier);

	let zoneId = req.params.zone_identifier;
	let records = await CFRecords.getRecords(zoneId);

	records[0].result.forEach(function(entry) {
		let entryClean = Validate.cleanRecords(entry);

		log.info(entryClean);
		let record = new Records(entryClean);
		record.save();
	});

	res.status(200).json({
		result: 'success',
		message: 'Record updated',
	});
};