'use strict';

import Validate from './validate';

let cleanRecords = async function(zoneId) {
	let cloudflareRecords = [];
	let records = await getRecords(zoneId);

	records[0].result.forEach(async function(entry) {
		cloudflareRecords.push(await Validate.cleanRecords(entry));
	});

	return cloudflareRecords;
};

let createRecord = async function(record) {
	try {
		let generatedRecord = Cloudflare.DNSRecord.create(record);
		console.log(generatedRecord.__verymeta.data);
		return await cf.addDNS(generatedRecord);
	} catch (error) {
		log.error({
			error: error,
		}, 'Error creating a record in Cloudflare');
	}
};

let getRecords = function(zoneId) {
	return cf.browseDNS(zoneId, {page: 1, per_page: 50})
			.then(function(result) {
			let promises = [Promise.resolve(result)];
			for (let i = 2; i <= result.totalPages; i++) {
				promises.push(client.browseDNS(zoneId, {page: i, per_page: 50}));
			}
			return Promise.all(promises);
		});
};

let deleteRecord = async function(zoneId, id) {
	let data = {
			zoneId: zoneId,
			id: id,
		};

	cf.deleteDNS(await Cloudflare.DNSRecord.create(data));
};


let updateRecord = async function(record) {
	try {
		await cf.editDNS(await Cloudflare.DNSRecord.create(record));
	} catch (error) {
		log.error({
			error: error,
		}, 'Error updating a record in Cloudflare');
	}
};

module.exports = {
	cleanRecords: cleanRecords,
	createRecord: createRecord,
	deleteRecord: deleteRecord,
	getRecords: getRecords,
	updateRecord: updateRecord,
};
