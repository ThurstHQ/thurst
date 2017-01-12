var jwt      = require('jwt-simple'),
    fs = require('fs'),
    path = require('path'),
    fsExtra = require('fs-extra'),

    User     = require('../../models/user'),
    GeoPoint = require('../../models/geojson'),

    config = require('../../../config/config').config,
    appDir = path.dirname(require.main.filename);

exports.getUserProfile = function (req, res, next) {

    User.findById(req.user._id, { password:0, verify_token:0 }, function(err, user) {
        if (err) return res.status(500).json({'Error :': err}); //TODO: change to err.message in prod
        if (!user) {
            return res.status(403).send({success: false, "message": 'Authentication failed. User not found.'});
        } else {
            return res.json(user);
        }
    });

};

exports.editUserProfile = function (req, res, next) {

    User.findByIdAndUpdate(req.user._id, req.body, { fields:{ password:0, verify_token:0 }, new:true }, function (err, user) {
        if (err) return res.status(500).json({'Error': err});
        console.log(user);

        res.json(user)
    });

};

exports.deleteProfile = function (req, res, next) {
    if (req.user._id) {
        User.findByIdAndRemove(req.user._id, function (err, data) {
            if (err) return res.status(500).json({'Error message': err.message});
            fsExtra.remove(path.join('public', 'images', req.user._id.toString()), function (err, data) {
                if (err) return res.status(500).json({'Error': err.message});
                return res.json({success: true, "message": 'The user was successfully removed.'});
            });
        });
    } else {
        return res.json({success: false, "message": 'The user was not successfully removed.'});
    }
};

exports.deleteDatabase = function (req, res, next) {

    User.collection.remove( {} , function (err, data) {
        if (err) return res.status(500).json({'Error message': err});
        GeoPoint.collection.remove( {} , function (err, data) {
            if (err) return res.status(500).json({'Error message': err});
            return res.json({success: true, "message": 'Collection was successfully removed.'});
        });
    });

};

exports.Search = function (req, res, next) {
    var reqQuery = req.query,
        queryArr = [],

        // send next docs per page
        reqPage = req.query.page - 1 || 0,

        // send docs per request
        reqAmount = req.query.amount || 10;
    console.log(reqQuery.page);
    console.log(reqQuery.amount);
    console.log(Object.keys(reqQuery).length);

    if (Object.keys(reqQuery).length == 2) {

        if (req.user.loc) {

            User.find({
                coords : {
                    $near : [ req.user.coords[0] , req.user.coords[1] ]
                },
                _id: {'$ne': req.user._id},
                invisible: {'$ne': true},
                verified: {'$ne': false}
            }, { password: 0 })
                .skip(reqPage*10)
                .limit(parseInt(reqAmount))
                .exec(function (err, users) {
                    if (err) return res.status(500).send({message: err});
                    // User.find({coords: []}, function (err, usersWithoutCoords) {
                    //     if (err) return res.status(500).send({message: err.message});
                    //     res.json(users.concat(usersWithoutCoords));
                    // });
                    res.json(users);
                });

        } else {
            User
                .find({ _id: {'$ne': req.user._id}, invisible: {'$ne': true}, verified: {'$ne': false} })
                .sort({"created": -1})
                .skip(reqPage*10)
                .limit(parseInt(reqAmount))
                .exec(function (err, users) {
                    if (err) return res.status(500).send({message: err.message});
                    return res.json(users);
                });
        }

    } else {
            for (var field in reqQuery) {
                var separateObj = {};

                if (field === 'sexuality') {
                    var searchSexuality = new RegExp(reqQuery.sexuality, 'i');
                    separateObj.sexuality = {$regex: searchSexuality};
                } else if (field === 'gender') {
                    var arrGender = new RegExp(reqQuery.gender, 'i');
                    separateObj.gender = {$regex: arrGender};
                } else if (field === 'maxdistance' && req.user.loc) {
                    separateObj = {
                        coords: {
                            $near: [ req.user.coords[0], req.user.coords[1]],
                            $maxDistance: req.query.maxdistance / 111.12
                        }
                    }
                }
                queryArr.push(separateObj);
            }
            // if (!req.query.maxdistance && req.user.loc) {
            //     separateObj = {
            //         coords: {
            //             $near: [ req.user.coords[0], req.user.coords[1]]
            //         }
            //     };
            //     queryArr.push(separateObj);
            // }
            console.log('Advanced');
            console.log(queryArr);
            User
                .find({_id: {'$ne': req.user._id}, invisible: {'$ne': true}, verified: {'$ne': false}}, {
                    password: 0,
                    verify_token: 0
                })
                .and(queryArr)
                .skip(reqPage * 10)
                .limit(parseInt(reqAmount))
                .exec(function (err, users) {
                    if (err) return res.status(500).send({message: err.message});
                    return res.json(users);
                });
        // User.find({
        //     coords : {
        //         $near : [ parseFloat(req.params.lon) , parseFloat(req.params.lat) ]
        //     }
        // })
        //     .limit(parseInt(reqAmount))
        //     .populate('userId', 'gender sexuality')
        //     .exec(function (err, geopoints) {
        //         if (err) return res.send(err);
        //
        //         res.send(geopoints)
        //     });


        }
};


exports.setLocation = function (req, res, next) {

    if (req.user._id && req.body.longitude && req.body.latitude) {
        req.user.coords = [req.body.longitude, req.body.latitude];
        req.user.save(function (err, user) {
            if (err) return res.status(500).json({success: false, "message": err});
            // user.password = '';
            return res.json(user);
        });
    } else {
        res.status(500).json({"message": "Please enter coordinates of the point."});
    }
};

exports.setConnections = function (req, res, next) {
    if (req.body.connectionId) {
        if (req.user.connections.indexOf(req.body.connectionId) === -1) {
            req.user.connections.push(req.body.connectionId);
            req.user.save(function (err, user) {
                if (err) return res.status(500).json({success: false, "message": err});
                User.findById(req.body.connectionId, function (err, connectingUser) {
                    connectingUser.connectedBy.push(req.user._id);
                    connectingUser.save(function (err, user) {
                        if (err) return res.status(500).json({success: false, "message": err});
                        res.json({success: true, "message": 'You have connected user.'});
                    })
                });
            })
        } else {
            res.json({"message": "User already in your contact list."});
        }
    } else {
        res.status(500).json({"message": "Please send user id."});
    }
};

exports.deleteConnections = function (req, res, next) {
    if (req.query.connectionId) {
        req.user.connections.pull(req.query.connectionId);
        req.user.save(function (err, user) {
            if (err) return res.status(500).json({success: false, "message": err});
            User.findById(req.query.connectionId, function (err, connectingUser) {
                connectingUser.connectedBy.pull(req.user._id);
                connectingUser.save(function (err, user) {
                    if (err) return res.status(500).json({success: false, "message": err});
                    res.json({success: true, "message": 'You have connected user.'});
                })
            });
        })
    } else {
        res.status(500).json({"message": "Please send user id."});
    }
};

exports.getConnections = function (req, res, next) {
    var myConnections = {};

    User.findById(req.user._id)
        .populate({
            path: 'connections',
            select: 'username _id avatar gender pronouns sexuality',
            model: 'User'
        })
        .populate({
            path: 'connectedBy',
            select: 'username _id avatar gender pronouns sexuality',
            model: 'User'
        })
        .exec(function (err, user) {
            if (err) return res.status(500).json({success: false, "message": err});
            myConnections.iamconnected = user.connections;
            myConnections.connectedMe = user.connectedBy;
            res.json(myConnections);
    });

};

exports.getUserInfo = function (req, res) {

    if (req.params.id) {
        User
            .findOne({'_id': req.params.id},  { password:0, verify_token:0 })
            .exec(function (err, users) {
                if (err) return res.status(500).send({message: 'Something is wrong... Problem accessing the server'});
                res.json(users);
            });
    } else {
        res.status(500).json({"message": "Please send user id."});
    }
};