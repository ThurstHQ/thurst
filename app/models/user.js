var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    username: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean
    },
    verify_token: {
        type: String
    },
    avatar: {
        type: String,
        default: ''
    },
    pictures: {
        type: [String]
    },
    sexuality: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        default: ''
    },
    loc: {
        type: Boolean,
        default: false
    },
    coords: [Number, Number],
    birthday: {
        type: Date,
        default: ''
    },
    pronouns: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    background: {
        type: [String],
        default: []
    },
    created: {
        type: Date,
        default: Date.now
    },
    invisible: {
        type: Boolean,
        default: false
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.statics.random = function(id, callback) {
    this.count(function(err, count) {
        if (err) {
            return callback(err);
        }
        var rand = Math.floor(Math.random() * (count));
        console.log('Random');
        console.log(rand);
        this.aggregate([
            { $match: { _id: {'$ne': id} }},
            { $sample: { size: 10 }}
        ]).exec(callback);
    }.bind(this));
};

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);