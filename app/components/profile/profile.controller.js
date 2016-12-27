var jwt      = require('jwt-simple'),

    User     = require('../../models/user'),

    config = require('../../../config/config').config;

exports.getUserProfile = function (req, res, next) {

    User.findById(req.user._id, { password:0, verify_token:0 }, function(err, user) {
        if (err) return res.status(500).json({'Error': err}); //TODO: change to err.message in prod
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


exports.rSearch = function (req, res, next) {

    User.random(req.user._id, function (err, doc) {
        if (err) return res.json({"Error": err});
        console.log(doc);
        return res.json(doc);
    });
    // var newGender = req.user.gender.split(' ').filter(function (item) {
    //     return item.length > 2;
    // });
    // var search = new RegExp(req.query.query, 'i');
    // console.log('newGender');
    // console.log(newGender);
    //
    //
    // var gender = new RegExp(req.user.gender, 'i');
    // User.find({})
    //     .or([
    //         {},
    //         {}
    //         ])
    //     .exec(function (err, user) {
    //     if (err) return res.status(500).json({'Error message': err});
    //     console.log(user);
    //     res.json(user);
    // })

};

exports.deleteProfile = function (req, res, next) {

    User.findByIdAndRemove(req.user._id, function (err, data) {
        if (err) return res.status(500).json({'Error message': err});
        return res.json({success: true, msg: 'The user was successfully removed.'});
    });

};

exports.deleteDatabase = function (req, res, next) {

    User.collection.remove( {} , function (err, data) {
        if (err) return res.status(500).json({'Error message': err});
        return res.json({success: true, msg: 'Collection was successfully removed.'});
    });

};

exports.Search = function (req, res, next) {
    console.log('req.query');
    console.log(req.query);

    var reqQuery = req.query,
        queryArr = [];

    console.log('Object.keys(reqQuery).length');
    console.log(Object.keys(reqQuery).length);

    if (Object.keys(reqQuery).length == 0) {
        User.random(req.user._id, function (err, doc) {
            if (err) return res.json({"Error": err});
            return res.json(doc);
        });
    } else {
        for (var field in reqQuery){
            // if (reqQuery[field].length > 0) {
                var separateObj = {};

                if (field === 'sexuality') {
                    var searchSexuality= new RegExp(reqQuery.sexuality, 'i');
                    separateObj.sexuality = {$regex: searchSexuality};
                } else if (field === 'gender') {
                    var arrGender = reqQuery.gender.split(',');
                    separateObj.gender = {$regex: arrGender};
                } else if (field === 'articleNumber') {

                }
                queryArr.push(separateObj);
            // }
        }
        console.log('queryArr');
        console.log(queryArr);

        User
            .find({ _id: {'$ne': req.user._id} })
            .and(queryArr)
            .exec(function (err, users) {
                if (err) return res.status(500).send({message: err.message});
                return res.json(users);
            });
    }


};