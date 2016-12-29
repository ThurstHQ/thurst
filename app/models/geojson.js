var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GeoJsonSchema = new mongoose.Schema({
    userId: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    point: mongoose.Schema.Types.Point
});

module.exports = mongoose.model('GeoJson', GeoJsonSchema);