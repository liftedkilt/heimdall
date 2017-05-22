'use strict';

var mongoose = require('mongoose');

var RecordSchema = new mongoose.Schema({
	content: {
		required: true,
		type: String,
	},
	name: {
		maxlength: 255,
		required: true,
		type: String,
	},
	type: {
		enum: [
			'A',
			'AAAA',
			'CNAME',
			'LOC',
			'MX',
			'NS',
			'SPF',
			'SRV',
			'TXT',
		],
		required: true,
		trim: true,
		type: String,
	},
	zoneId: {
		required: true,
		type: String,
	},
	locked: {
		type: Boolean,
	},
	priority: {
		type: Number,
	},
	proxiable: {
		type: Boolean,
	},
	proxied: {
		default: false,
		type: Boolean,
	},
	ttl: {
		default: 1,
		type: Number,
	},
	zoneName: {
		type: String,
	},
},
{
	minimize: false,
	timestamps: {
		createdAt: 'createdOn',
		updatedAt: 'modifiedOn',
	},
});

var Record = mongoose.model('Record', RecordSchema);

module.exports = Record;