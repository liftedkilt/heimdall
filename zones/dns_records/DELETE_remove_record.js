'use strict';

import Remap from '../../lib/remap';

export const route = {
	method: 'delete',
	path: '/zones/:zone_identifier/dns_records/:identifier',
	type: 'json',
};

export default async(req, res) => {
	log.debug({req: req}, 'DELETE received for %s record on zone %s', req.params.identifier, req.params.zone_identifier);

	let record = Remap.reqParams(req);
	Records.findOneAndRemove(record).exec();

	let data = {
		zoneId: req.params.zone_identifier,
		id: req.params.identifier,
	};

	let generatedRecord = await cloudflare.DNSRecord.create(data);

	cf.deleteDNS(generatedRecord);

	log.info('Record %s was deleted', generatedRecord.id);
	res.status(200).json({
		result: 'Record deleted',
		info: {
			'id': generatedRecord.id,
		},
	});
};