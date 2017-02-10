var jwt      = require('jwt-simple'),
    randomstring = require('randomstring'),
    bcrypt = require('bcrypt'),

    User     = require('../../models/user'),

    config = require('../../../config/config').config,
    sendEmail = require('../../global/sendmail').sendEmail;

exports.signUp = function (req, res, next) {
    var regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (regexp.test(req.body.email) && req.body.password) {
        var userEmail = req.body.email;
        User.findOne({
            email: userEmail
        }, function(err, user) {
            if (err) return res.status(403).json({"message": err.message});

            if (!user) {
                var verificationToken = randomstring.generate({ length: 4 });
                // console.log('userEmail');
                // console.log(userEmail);
                var newUser = new User({
                    email: userEmail,
                    password: req.body.password,
                    verified: false,
                    verify_token: verificationToken
                });
                // Create user if not found him
                newUser.save(function(err, user) {
                    // console.log('user');
                    // console.log(user);
                    if (err) {
                        return res.json({success: false, "message": err});
                    }
                    var newMail = {
                        to: userEmail,
                        subject: 'Verification email',
                        text: 'Please confirm your email address. Code: ' + verificationToken
                    };
                    sendEmail(newMail.to, newMail.subject, newMail.text);

                    res.json({success: true, verify: false, "message": 'Successful created new user.', id: user.id});
                });
            } else {

                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {

                        if (!user.verified) {
                            var verificationToken = randomstring.generate({ length: 4 });

                            user.verify_token = verificationToken;
                            user.save(function (err, data) {
                                if (err) {
                                    return res.json({success: false, "message": err});
                                }
                                var newMail = {
                                    to: userEmail,
                                    subject: 'Verification email',
                                    text: 'Please confirm your email address. Code: ' + verificationToken
                                };
                                sendEmail(newMail.to, newMail.subject, newMail.text);

                                return res.json({success: true, verify: false, id: user.id, "message": 'User email not verified.'});
                            });
                        } else {
                            var token = jwt.encode(user, config.getEnv().secret);
                            res.json({success: true, verify: true, token: 'JWT ' + token});
                        }
                    } else {
                        res.status(403).send({success: false, "message": 'Authentication failed. Wrong password.'});
                    }
                });
            }
        });
    } else {
        res.status(500).send({success: false, "message": 'Send email and password please.'});
    }
};

exports.verify = function (req, res, next) {
    var code = req.body.code,
        userId = req.body.id;

    User.findOne({ _id: userId }, function (err, user) {
        if (err) return res.status(403).json({"message": err.message});
        if (user.verify_token == code) {
            // console.log('that token is correct! Verify the user');

            User.findOneAndUpdate({_id: userId}, {'verified': true, 'verify_token': ''}, function (err, resp) {
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

exports.changePass = function (req, res, next) {
    if (req.body.password && req.body.newpassword) {
        req.user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
                req.user.password = req.body.newpassword;
                req.user.save(function (err, user) {
                    if (err) return res.status(500).send({'message': err.message});
                    user.password = '';
                    return res.json(user);
                });
            } else {
                res.status(403).send({success: false, "message": 'Wrong previously password.'});
            }
        });
    } else {
        res.status(500). json({"message": "Need field password."})
    }
};

exports.forgotEmail = function (req, res, next) {
    if (req.body.email) {
        User.findOne({email: req.body.email}, function (err, user) {
            if (err) return res.status(500).json({success: false, "message": "User not found in database"});
            var verificationCode = randomstring.generate({length: 4});
            user.forgotPassCode = verificationCode;
            user.save();
            var newMail = {
                to: user.email,
                subject: 'Thurst: Code for restore password',
                text: `Code for restore password: ${ verificationCode }`
            };
            sendEmail(newMail.to, newMail.subject, newMail.text);
            res.json({success: true, "message": "Check your e-mail please."});
        });
    } else {
        res.status(500).json({success: false, "message": "Enter e-mail."})
    }

};

exports.forgotCode = function (req, res) {
    if (req.body.code && req.body.code !== "") {
        User.findOne({forgotPassCode: req.body.code}, function (err, user) {
            if (err) return res.status(500).json({success: false, "message": "Code not found in database"});
            return res.json({success: true});
        });
    } else {
        res.status(500).json({success: false, "message": "Enter code please."})
    }
};

exports.restorePassword = function (req, res) {
    if (req.body.email && req.body.password && /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/.test(req.body.password)) {
        User.findOne({email: req.body.email}, function (err, user) {
            if (err) return res.status(500).send({"message": err.message});

            user.password = req.body.password;
            user.forgotPassCode = '';
            user.save(function (err, newuser) {
                if (err) return res.status(500).send({"message": err.message});
                newuser.password = undefined;
                var token = jwt.encode(newuser, config.getEnv().secret);
                if (user.verified) {
                    return res.json({success: true, verify: newuser.verified, token: 'JWT ' + token});
                } else {
                    var verificationCode = randomstring.generate({length: 4});
                    var newMail = {
                        to: newuser.email,
                        subject: 'Welcome to Thurst',
                        text: `Code for restore password: ${ verificationCode }`
                    };
                    console.log(newMail);
                    sendEmail(newMail.to, newMail.subject, newMail.text);
                    return res.json({success: true, verify: false});
                }
            });
        });
    } else {
        res.status(500).json({success: false, "message": "Please send password with such requirements: 6-20 letters, numbers or symbols !@#$%^&*()_"})
    }
};