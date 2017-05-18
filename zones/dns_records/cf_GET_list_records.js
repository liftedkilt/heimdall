'use strict';

import CfRecords from '../../lib/cloudflarerecords';

export const route = {
	method: 'get',
	path: '/cf/zones/:zone_identifier/dns_records',
	type: 'json',
};

export default async(req, res) => {
	log.debug({req: req}, 'received request');

	try {
		return CfRecords.getRecords(req.params.zone_identifier);
	} catch (error) {
		log.error({ error: error }, 'Error listing records');
		res.status(500).json({
			result: 'error',
			message: 'Cannot list records',
			info: {
				error: error,
			},
		});
	}
};
