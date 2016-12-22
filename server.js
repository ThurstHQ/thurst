var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var User        = require('./app/models/user');
var port        = process.env.PORT || 8080;
var jwt         = require('jwt-simple');
var randomstring = require('randomstring');
var config = require('./config/config').config;

var sendEmail = require('./app/global/sendmail').sendEmail;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.use(passport.initialize());

mongoose.connect(config.getEnv().database);

require('./config/passport')(passport);

var apiRoutes = express.Router();

app.get('/', function(req, res) {
    res.send('Hello! The API is working.');
});

apiRoutes.post('/authenticate', function(req, res) {
    //TODO: if (!req.body.email)
    // if (req.body.email) {
    //     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    // } else {
    //
    // }

    var userEmail = req.body.email;

    User.findOne({
        email: userEmail
    }, function(err, user) {
        if (err) return res.status(403).json({"message": err.message});

        if (!user) {
            var verificationToken = randomstring.generate({ length: 4 });

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

                res.json({success: true, newuser: true, msg: 'Successful created new user.', id: user.id});
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

                            return res.json({success: true, newuser: true, id: user.id, msg: 'User email not verified.'});
                        });
                    } else {
                        var token = jwt.encode(user, config.getEnv().secret);
                        res.json({success: true, newuser: false, token: 'JWT ' + token});
                    }
                } else {
                    res.status(403).send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

apiRoutes.post('/verify', function (req, res) {
    var code = req.body.code;
    var userId = req.body.id;

    User.findOne({ _id: userId }, function (err, user) {
        if (user.verify_token == code) {
            console.log('that token is correct! Verify the user');

            User.findOneAndUpdate({_id: userId}, {'verified': true}, function (err, resp) {
                if (err) return res.status(500).send({'message': err.message});
                console.log('The user has been verified!');
            });

            var token = jwt.encode(user, config.secret);

            return res.json({success: true, newuser: false, token: 'JWT ' + token});
        } else {
            return res.status(401).json({ 'message': 'The code is wrong! User email not confirmed.' })
        }
    });
});

apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                return res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

app.use('/api', apiRoutes);

app.listen(port);
console.log('Server working...');

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};