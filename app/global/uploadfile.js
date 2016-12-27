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

var Busboy = require('busboy');

exports.uploadFiles = function (req, res, next) {
    // console.log(req.user);
    // console.log('appDIr');
    // console.log(appDir);

    var userId = req.user._id || 'empty userId',
        userFile = {};

    // console.log('userId');
    // console.log(userId);

    var pathForSave = path.join('public', 'images', userId.toString());

    // console.log('headers');
    // console.log(req.headers);
    // console.log('pathForSave');
    // console.log(pathForSave);

    if (req.body.avatar) {
        var base64Data = req.body.avatar.replace(/^data:image\/jpeg;base64,/, "");

        mkdirp(pathForSave, function (err) {
            var randomString = randomstring.generate({ length: 4 }),
                pathToImg = path.join(pathForSave, userId.toString() + randomString + ".jpeg");
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

    // mkdirp(pathForSave, function (err) {
    //     if (err) return res.status(500).json({"message": "Server can\'t create folder."});
    //     var saveTo = '';
    //     busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    //
    //         saveTo = path.join(appDir, pathForSave, filename);
    //         userFile.localPath = path.join(pathForSave, filename);
    //         userFile.filename = filename;
    //
    //         // console.log('saveTo');
    //         // console.log(saveTo);
    //
    //         file.pipe(fs.createWriteStream(saveTo));
    //     });
    //     busboy.on('finish', function() {
    //         console.log(userFile.localPath);
    //         User.findByIdAndUpdate(new ObjectId(userId), {avatar: userFile.localPath}, function (err, user) {
    //             if (err) {
    //                 return res.status(500).json({message: "Something wrong... You can\'t upload file"})
    //             }
    //             // console.log(appDir);
    //             // console.log(userFile.localPath);
    //             easyimg.resize({
    //                 src: saveTo,
    //                 dst: path.join(appDir, userFile.localPath),
    //                 width: 250, height: 250
    //             }).then(
    //                 function(image) {
    //                     console.log('Resized: ' + image.width + ' x ' + image.height);
    //                 },
    //                 function (err) {
    //                     console.log(err);
    //                 }
    //             );
    //             res.writeHead(200, { 'Connection': 'close' });
    //             res.end(userFile.localPath);
    //         });
    //     });
    //     return req.pipe(busboy);
    // });

};

