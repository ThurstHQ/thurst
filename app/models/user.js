var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    username: {
        type: String
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
        type: [Number], // [<longitude>, <latitude>]
        default: []
    },
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

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);