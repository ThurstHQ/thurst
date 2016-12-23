var JwtStrategy = require('passport-jwt').Strategy;

var User = require('../app/models/user');
var config = require('../config/config').config;
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function(passport) {
    var opts = {};
    opts.secretOrKey = config.getEnv().secret;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findById(jwt_payload._id, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                if (!user.verified) {
                    return done({message: 'User email not verified.', newuser: true}, false);
                }
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};