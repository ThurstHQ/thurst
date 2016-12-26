var jwt      = require('jwt-simple'),
    randomstring = require('randomstring'),

    User     = require('../../models/user'),

    config = require('../../../config/config').config,
    sendEmail = require('../../global/sendmail').sendEmail;

exports.signUp = function (req, res, next) {
    //TODO: if (!req.body.email)
    // if (req.body.email) {
    //     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    // } else {
    //
    // }
    console.log(req.body);
    var userEmail = req.body.email;

    User.findOne({
        email: userEmail
    }, function(err, user) {
        if (err) return res.status(403).json({"message": err.message});

        if (!user) {
            var verificationToken = randomstring.generate({ length: 4 });
            console.log('userEmail');
            console.log(userEmail);
            var newUser = new User({
                email: userEmail,
                password: req.body.password,
                verified: false,
                verify_token: verificationToken
            });
            // Create user if not found him
            newUser.save(function(err, user) {
                console.log('user');
                console.log(user);
                if (err) {
                    return res.json({success: false, msg: err});
                }
                var newMail = {
                    to: userEmail,
                    subject: 'Verification email',
                    text: 'Please confirm your email address. Code: ' + verificationToken
                };
                sendEmail(newMail.to, newMail.subject, newMail.text);

                res.json({success: true, verify: false, msg: 'Successful created new user.', id: user.id});
            });
        } else {

            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {

                    if (!user.verified) {
                        var verificationToken = randomstring.generate({ length: 4 });

                        user.verify_token = verificationToken;
                        user.save(function (err, data) {
                            if (err) {
                                return res.json({success: false, msg: err});
                            }
                            var newMail = {
                                to: userEmail,
                                subject: 'Verification email',
                                text: 'Please confirm your email address. Code: ' + verificationToken
                            };
                            sendEmail(newMail.to, newMail.subject, newMail.text);

                            return res.json({success: true, verify: false, id: user.id, msg: 'User email not verified.'});
                        });
                    } else {
                        var token = jwt.encode(user, config.getEnv().secret);
                        res.json({success: true, verify: true, token: 'JWT ' + token});
                    }
                } else {
                    res.status(403).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
};

exports.verify = function (req, res, next) {
    var code = req.body.code,
        userId = req.body.id;

    User.findOne({ _id: userId }, function (err, user) {
        if (user.verify_token == code) {
            // console.log('that token is correct! Verify the user');

            User.findOneAndUpdate({_id: userId}, {'verified': true}, function (err, resp) {
                if (err) return res.status(500).send({'message': err.message});
                console.log('The user has been verified!');

                var token = jwt.encode(user, config.getEnv().secret);

                return res.json({success: true, verify: true, token: 'JWT ' + token});
            });
        } else {
            return res.status(401).json({ 'message': 'The code is wrong! User email not confirmed.' })
        }
    });
};