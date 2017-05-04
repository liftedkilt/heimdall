'use strict';

const validate = require('../../utils/validate');

export const route = {
	method: 'post',
	path: '/zones/:zone_identifier/dns_records/:identifier',
	type: 'json',
};

export default async(req, res) => {
	log.debug({req: req}, 'received request');
	let error = validate.reqParams(req, 'cannot update record - missing required parameters');

	if (error !== '') {
		res.status(403).json(error);
	} else {
		let data = req.body || {};
		data.id = req.params.identifier;
		data.zoneId = req.params.zone_identifier;

		await Records.findOneAndUpdate({

			id: req.params.identifier,
			zoneId: req.params.zone_identifier,
		}, {
			data,
		},
		{
			new: true,
		})
		.then(function (record) {
			let generatedRecord = cloudflare.DNSRecord.create(data);

			log.info(generatedRecord);

			let editedRecord = {
				'name': generatedRecord.name,
				'content': generatedRecord.content,
				'type': generatedRecord.type,
				'ttl': generatedRecord.ttl,
				'proxied': generatedRecord.proxied,
			};

			log.info(editedRecord);
			return cf.editDNS(generatedRecord);
		})
		.then(async function(record) {
			log.info(record.id);
			data.id = record.id;

			// Write record to DB
			let entry = new Records(data);
			await entry.save();
			return data;
		})
		.then(function(record) {
			log.info('record updated');
			res.status(200).json({
				result: 'success',
				message: 'Record updated',
				info: {
					content: req.body.content,
					name: req.body.name,
					proxied: req.body.proxied,
					ttl: req.body.ttl,
					type: req.body.type,
				},
			});
		})
		.catch(function(error) {
			log.error({error: error}, 'Error updating a record');
			res.status(500).json({
				result: 'error',
				message: 'Cannot update record',
				info: {
					error: error,
				},
			});
		});
	}
};
