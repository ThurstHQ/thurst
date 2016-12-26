var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../app/models/user');
var config = require('../config/config').config;

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.secretOrKey = config.getEnv().secret;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findById(jwt_payload._id, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                if (!user.verified) {
                    return done({message: 'User email not verified.', verify: false}, false);
                }
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};