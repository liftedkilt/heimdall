/**
 * Model Schema
 */
const Records = require('./models/records')


function keyNamer(data) {
	data._name = data.name;
	delete data.name;

	data._type = data.type;
	delete data.type;

	return data;
}

export const route = {
	method: 'delete',
	path: '/zones/:zone_identifier/dns_records/:record_id',
	type: 'json',
};

export default async(req, res) => {
	try {
		await Records.findOneAndRemove({
			_id: req.params.record_id,
			zone_id: req.params.zone_identifier
		}).exec();
	} catch (error) {
		res.status(500).json({
			error: 'Cannot delete record'
		});
	}
};