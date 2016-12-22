var JwtStrategy = require('passport-jwt').Strategy;

var User = require('../app/models/user');
var config = require('../config/config').config;

module.exports = function(passport) {
    var opts = {};
    opts.secretOrKey = config.getEnv().secret;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({id: jwt_payload.id}, function(err, user) {
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