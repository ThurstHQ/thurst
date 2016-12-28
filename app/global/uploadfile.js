var http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    easyimg = require('easyimage'),
    appDir = path.dirname(require.main.filename),
    randomstring = require('randomstring'),

    User = require('../models/user');

var ObjectId = require('mongoose').Types.ObjectId;

exports.uploadFiles = function (req, res, next) {

    var userId = req.user._id || 'empty userId';

    var pathForSave = path.join('public', 'images', userId.toString());

    if (req.body.avatar) {
        var base64Data = req.body.avatar.replace(/^data:image\/jpeg;base64,/, "");

        mkdirp(pathForSave, function (err) {
            var randomString = randomstring.generate({ length: 4 }),
                pathToImg = path.join(pathForSave, userId.toString() + '-' + randomString + ".jpeg");
            fs.writeFile(pathToImg, base64Data, 'base64', function(err, data) {
                if (err) {
                    return res.status(500).json({message: "Something wrong... You can\'t upload file"})
                }

                User.findByIdAndUpdate(new ObjectId(userId), {avatar: pathToImg}, function (err, user) {
                    if (err) {
                        return res.status(500).json({message: "Something wrong... You can\'t upload file"})
                    }
                    // console.log(appDir);
                    // console.log(userFile.localPath);
                    easyimg.resize({
                        src: pathToImg,
                        dst: pathToImg,
                        width: 250, height: 250
                    }).then(
                        function(image) {
                            console.log('Resized: ' + image.width + ' x ' + image.height);
                        },
                        function (err) {
                            console.log(err);
                        }
                    );

                return res.json({"Success": true, "path": pathToImg})

                });
            });
        })
    }

};

