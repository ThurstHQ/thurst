var http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    randomstring = require('randomstring'),
    easyimg = require('easyimage'),

    User = require('../models/user');

var ObjectId = require('mongoose').Types.ObjectId;

exports.uploadFiles = function (req, res, next) {

    var userId = req.user._id || 'empty userId',
        userIdString = req.user._id.toString();

    if (req.body.avatar) {

        var AWS = require('aws-sdk');
        AWS.config.accessKeyId = process.env.AKI;
        AWS.config.secretAccessKey = process.env.SAK;
        AWS.config.region = "us-west-2";

        var s3Bucket = new AWS.S3( { params: {Bucket: 'images3763246283746'} } );

        // buf = new Buffer(req.body.avatar.replace(/^data:image\/\w+;base64,/, ""),'base64');

        var base64Data = req.body.avatar.replace(/^data:image\/\w+;base64,/, "");

        fs.writeFile(path.join('upload', userIdString + ".jpeg"), base64Data, 'base64', function(err) {
            if (err) { console.log('1= ', err); }

            easyimg.resize({
                src: path.join('upload', userIdString + ".jpeg"),
                dst: path.join('upload', userIdString + ".jpeg"),
                width: 250, height: 250
            }).then(
                function(image) {
                    console.log('image = ', image);
                    s3Bucket.createBucket({Bucket: 'images3763246283746'}, function(err, result) {
                        if (err) console.log('2= ', err);

                        var data = {
                            Key: userIdString + '.jpeg',
                            Bucket: 'images3763246283746',
                            Body: fs.readFileSync(path.join('upload', userIdString + ".jpeg")),
                            ACL: 'public-read'
                        };

                        s3Bucket.putObject(data, function(err, data){
                            if (err) {
                                if (err) console.log('7= ', err);
                            } else {
                                fs.unlink(path.join('upload', userIdString + ".jpeg"), function (err, data) {
                                    if (err) console.log('6= ', err);
                                });

                                User.findByIdAndUpdate(new ObjectId(userId), {avatar: "https://s3-us-west-2.amazonaws.com/images3763246283746/" + userIdString + ".jpeg"}, function (err, user) {
                                    if (err) {
                                        console.log('5= ', err)
                                    }
                                    return res.json({"success": true, "path": "https://s3-us-west-2.amazonaws.com/images3763246283746/" + userIdString + ".jpeg"});
                                });
                            }
                        });
                    });
                },
                function (err) {
                    console.log('3= ', err);
                }
            )
                .catch(function (err) {
                    console.log('4= ', err);
                });
        });
    }

};

