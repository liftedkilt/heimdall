// for record in cloudflare;
// 	if ! in mongodb
// 		delete record
// for record in mongodb;
// 	if ! in cloudflare
// 		create record;

// for record in mongodb;
// 	if ! deepEqual(record, getCfRecordById(record.id))
// 		then update record


// for record in cloudflare;
// 	if findRecord(mongo, record.id) {
// 		// record found
// 	} else {
// 		cloudflare.recordDelete(record);
// 	}

// for record in mongodb;
// 	if findRecord(cf, record.id) {
// 		// record found
// 	} else {
// 		cloudflare.recordCreate(record);
// 	}

// for record in mongodb;
// 	if (deepEqual(record, findRecord(cf, record.id) == true)) {
// 		// records are equal
// 	} else {
// 		cloudflare.recordUpdate(record);
// 	}

// lodash.filter(array, {'id': '8a0479b3b5c49b5826258e67974432fe'})