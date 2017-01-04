var jwt      = require('jwt-simple'),
    fs = require('fs'),
    path = require('path'),
    fsExtra = require('fs-extra'),

    User     = require('../../models/user'),
    GeoPoint = require('../../models/geojson'),

    config = require('../../../config/config').config;

exports.getUserProfile = function (req, res, next) {

    User.findById(req.user._id, { password:0, verify_token:0 }, function(err, user) {
        if (err) return res.status(500).json({'Error :': err}); //TODO: change to err.message in prod
        if (!user) {
            return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
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
                return res.json({success: true, msg: 'The user was successfully removed.'});
            });
        });
    } else {
        return res.json({success: false, msg: 'The user was not successfully removed.'});
    }
};

exports.deleteDatabase = function (req, res, next) {

    User.collection.remove( {} , function (err, data) {
        if (err) return res.status(500).json({'Error message': err});
        GeoPoint.collection.remove( {} , function (err, data) {
            if (err) return res.status(500).json({'Error message': err});
            return res.json({success: true, msg: 'Collection was successfully removed.'});
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
        //TODO: random search by "sample function"
        // User.random(req.user._id, function (err, doc) {
        //     if (err) return res.json({"Error": err});
        //     return res.json(doc);
        // });
        // }

        //TODO: random for search newest user field "created"
        // User
        //     .find({ _id: {'$ne': req.user._id}, invisible: {'$ne': true}, verified: {'$ne': false} })
        //     .sort({"created": -1})
        //     .skip(reqPage*10)
        //     .limit(parseInt(reqAmount))
        //     .exec(function (err, users) {
        //         if (err) return res.status(500).send({message: err.message});
        //         return res.json(users);
        //     });
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
                    if (err) return res.send(err);

                    res.send(users)
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
            if (err) return res.json(err);
            user.password = '';
            return res.json(user);
        });
    } else {
        res.status(500).json({"message": "Please enter coordinates of the point."});
    }
};

exports.setConnections = function (req, res, next) {
    req.user.connections.push(req.body.connectionId);
    req.user.save(function (err, user) {
        if (err) return res.status(500).json({success: false, msg: err});
        User.findById(req.body.connectionId, function (err, connectingUser) {
            connectingUser.connectedBy.push(req.user._id);
            connectingUser.save(function (err, user) {
                if (err) return res.status(500).json({success: false, msg: err});
                res.json({success: true, msg: 'You have connected user.'});
            })
        });
    })
};

exports.deleteConnections = function (req, res, next) {
    req.user.connections.pull(req.body.connectionId);
    req.user.save(function (err, user) {
        if (err) return res.status(500).json({success: false, msg: err});
        User.findById(req.body.connectionId, function (err, connectingUser) {
            connectingUser.connectedBy.pull(req.user._id);
            connectingUser.save(function (err, user) {
                if (err) return res.status(500).json({success: false, msg: err});
                res.json({success: true, msg: 'You have connected user.'});
            })
        });
    })
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
            if (err) return res.status(500).json({success: false, msg: err});
            myConnections.iamconnected = user.connections;
            myConnections.connectedMe = user.connectedBy;
            res.json(myConnections);
    });

};