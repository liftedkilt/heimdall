import bunyan from 'bunyan';
import mongoose from 'mongoose';
import cloudflare from 'cloudflare';

const config = require('./config');
const magnetConfig = require('./magnet.config.js');

global.cf = new cloudflare({
	'email': config.cfEmail,
	'key': config.cfToken,
});
global.Cloudflare = require('cloudflare');
global.log = bunyan.createLogger({'name': 'heimdall', 'level': 'info'});
global.Record = require('./models/record');

mongoose.Promise = global.Promise;
mongoose.connect(config.db.uri);

export default (app, magnet) => {
	log.info('Running on port %s', magnetConfig.magnet.port);
};
