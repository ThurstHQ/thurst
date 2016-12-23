var getToken = require('../../global/gettoken').getToken,
    jwt      = require('jwt-simple'),

    User     = require('../../models/user'),

    config = require('../../../config/config').config;

exports.getUserProfile = function (req, res, next) {
        var token = getToken(req.headers);

        if (token) {
            var decoded = jwt.decode(token, config.getEnv().secret);
            console.log('decoded');
            console.log(decoded);
            User.findById(decoded._id, { password:0 }, function(err, user) {
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

exports.editUserProfile = function (req, res, next) {
    var token = getToken(req.headers);

    if (token) {
        var decoded = jwt.decode(token, config.getEnv().secret);
        User.findOne({ _id: decoded._id }, { password:0 }, function(err, user) {
            if (err) return res.status(500).json({'Error': err});
            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                //logic
                for (var field in req.body) {
                    // if (field === 'currentPass') {
                    //     var isPassValid = user.comparePassword(req.body.currentPass, function (err, isMatch) {
                    //         if (err) res.status(500).json({'Error': err});
                    //         if (isMatch) {
                    //
                    //         }
                    //     });
                    //     if (isPassValid) {
                    //         req.user.password = generateHash(req.body.newPass)
                    //     } else {
                    //         return res.status(403).send({message: "Your current password is wrong!"});
                    //     }
                    // }
                    user[field] = req.body[field];
                    console.log(req.body[field]);
                }
                console.log('-user');
                console.log(user);
                user.save(function (err, user) {
                    if (err) {
                        err.code === 11000 ? res.status(500).send({message: 'This email or uid is already taken, please choose another one!'}) : res.status(500).send({message: err.message});
                    }
                    res.json(user)
                })
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
};