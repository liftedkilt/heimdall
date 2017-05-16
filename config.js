'use strict';

let mongoPort = process.env.mongoPort || '27017';
let mongoIP = process.env.mongoIP || '127.0.0.1';
let mongoDbName = process.env.mongoDbName || 'heimdall';
let cfEmail = process.env.cfEmail || '';
let cfToken = process.env.cfToken || '';
let heimdallCluster = process.env.heimdallCluster || false;

module.exports = {
	db: {
		uri: 'mongodb://' + mongoIP + ':' + mongoPort + '/' + mongoDbName,
	},
	cfEmail: cfEmail,
	cfToken: cfToken,
	heimdallCluster: heimdallCluster,
};
