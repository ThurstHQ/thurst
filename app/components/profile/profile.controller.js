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
            User.findOne({
                name: decoded.name
            }, function(err, user) {
                if (err) return res.status(500).json({'Error': err}); //TODO: change to err.message in prod

                if (!user) {
                    return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
                } else {
                    return res.json({success: true, msg: 'Welcome in the member area ' + user.email + '!'});
                }
            });
        } else {
            return res.status(403).send({success: false, msg: 'No token provided.'});
        }
};

exports.uploadImages = function (req, res, next) {
    var userId = req.user._id || 'userID empty';

};