'use strict';

const validate = require('../../lib/validate');
import lodash from 'lodash';

export const route = {
	method: 'post',
	path: '/zones/:zone_identifier/dns_records',
	type: 'json',
};

export default async(req, res) => {
	log.debug({req: req}, 'received request');
	let error = validate.reqParams(req, 'cannot create record - missing required parameters');
	if (error !== '') {
		res.status(403).json(error);
	} else {
		let data = req.body || {};
		data.zoneId = req.params.zone_identifier;

		try {
			let generatedRecord = Cloudflare.DNSRecord.create(data);
			return cf.addDNS(generatedRecord)
			.then(async function(record) {
				log.info(record.id);
				data.id = record.id;

				if (data.type == 'CNAME' && ! lodash.includes(data.name, data.content)) {
					data.name = data.name + '.' + data.content;
				}

				// Write record to DB
				let entry = new Records(data);
				await entry.save();
				log.debug('Record %s was created in DB', record.id);
				return data;
			});
		} catch(error) {
			log.error({error: error}, 'Record could not be written to Cloudflare');
			data.id = '';
			// Write record to DB
			let entry = new Records(data);
			entry.save();
			// Alert client that write partially failed
			res.status(201).json({
				result: 'Error',
				message: 'Record was written to DB, but was not propagated to Cloudflare',
			});
		}
	}
};
