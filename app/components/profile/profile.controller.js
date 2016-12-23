var getToken = require('../../global/gettoken').getToken,
    jwt      = require('jwt-simple'),

    User     = require('../../models/user'),

    config = require('../../../config/config').config;

exports.getUserProfile = function (req, res, next) {
        var token = getToken(req.headers);
        // console.log('!!!!!!!!');
        // console.log(req.headers);
        // console.log(req.user);

        if (token) {
            var decoded = jwt.decode(token, config.getEnv().secret);
            console.log('decoded');
            console.log(decoded);
            User.findOne({ _id: decoded._id }, { password:0 }, function(err, user) {
                if (err) return res.status(500).json({'Error': err}); //TODO: change to err.message in prod

                if (!user) {
                    return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                } else {
                    return res.json(user);
                }
            });
        } else {
            return res.status(403).send({success: false, msg: 'No token provided.'});
        }
};