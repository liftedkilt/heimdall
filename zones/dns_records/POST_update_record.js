'use strict';

const validate = require('../../lib/validate');

export const route = {
	method: 'post',
	path: '/zones/:zone_identifier/dns_records/:identifier',
	type: 'json',
};

export default async(req, res) => {
	log.debug({
		req: req,
	}, 'received request');
	let error = validate.reqParams(req, 'Cannot update record - missing required parameters');

	if (error !== '') {
		res.status(403).json(error);
	} else {
		let cfResult = null;
		let data = req.body || {};
		data.id = req.params.identifier;
		data.zoneId = req.params.zone_identifier;

		let generatedRecord = Cloudflare.DNSRecord.create(data);
		log.info('Updating record with new info: ', data);

		try {
			await cf.editDNS(generatedRecord);
			cfResult = true;
		} catch (error) {
			cfResult = false;

			log.error({
				error: error,
			}, 'Error updating a record in Cloudflare');
		}

		try {
			await Records.findOneAndUpdate({
						id: data.id,
						zoneId: data.zoneId,
					},
					data, {
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

		if (cfResult == true ) {
			res.status(200).json({
				result: 'success',
				message: 'Record updated in both MongoDB and Cloudflare',
				info: {
					content: req.body.content,
					name: req.body.name,
					proxied: req.body.proxied,
					ttl: req.body.ttl,
					type: req.body.type,
				},
			});
		} else if (cfResult == false) {
			res.status(200).json({
				result: 'partial',
				message: 'Record updated in DB but not in Cloudflare - will be updated on next sync',
				info: {
					content: req.body.content,
					name: req.body.name,
					proxied: req.body.proxied,
					ttl: req.body.ttl,
					type: req.body.type,
				},
			});
		}
	}
};
