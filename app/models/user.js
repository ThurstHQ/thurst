var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    username: {
        type: String,
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
        type: String
    },
    pictures: {
        type: [String]
    },
    sexuality: {
        type: String
    },
    gender: {
        type: String
    },
    loc: {
        type: [Number] // [<longitude>, <latitude>]
    },
    birthday: {
        type: Date,
        // required: true
    },
    pronouns: {
        type: String
    },
    bio: {
        type: String
    },
    background: {
        type: [String]
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