'use strict';

import MongoRecords from '../../lib/mongorecords';

export const route = {
	method: 'get',
	path: '/zones/:zone_identifier/dns_records/search',
	type: 'json',
};

export default async(req, res) => {
	log.debug({req: req}, 'received request');
	try {
		log.info('The records were retrieved for zone: %s', req.params.zone_identifier);
		let data = req.body || {};
		return await MongoRecords.searchRecords(req.params.zone_identifier, data);
	} catch (error) {
		log.error({error: error}, 'An error occurred while listing records');
		res.status(404).json({
			result: 'error',
			message: 'cannot list records',
			info: {
				error: error,
			},
		});
	};
};
