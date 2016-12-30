var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var dtSchema = new Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    longitude : Number,
    latitude  : Number,
    coords: [Number, Number]
});

module.exports = mongoose.model('GeoJson', dtSchema);