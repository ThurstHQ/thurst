var http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    easyimg = require('easyimage'),
    appDir = path.dirname(require.main.filename),

    User = require('../models/user');

var ObjectId = require('mongoose').Types.ObjectId;

var Busboy = require('busboy');

exports.uploadFiles = function (req, res, next) {
    console.log(req.user);
    console.log('appDIr');
    console.log(appDir);

    var userId = req.user._id || 'empty userId';

    console.log('userId');
    console.log(userId);

    var busboy = new Busboy({ headers: req.headers }),
        pathForSave = path.join('public', 'images', userId.toString());

    console.log('headers');
    console.log(req.headers);
    console.log('pathForSave');
    console.log(pathForSave);

    mkdirp(pathForSave, function (err) {
        if (err) return res.status(500).json({"message": "Server can\'t create folder."});
        var saveTo = '',
            userFile = {};
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

            console.log('---filename');
            console.log(fieldname);

            saveTo = path.join(appDir, pathForSave, filename);
            userFile.localPath = path.join(pathForSave, filename);
            userFile.filename = filename;

            console.log('saveTo');
            console.log(saveTo);

            file.pipe(fs.createWriteStream(saveTo));
        });
        busboy.on('finish', function() {
            User.findByIdAndUpdate(new ObjectId(userId), {avatar: userFile.localPath}, function (err, user) {
                if (err) {
                    return res.status(500).json({message: "Something wrong... You can\'t upload file"})
                }
                easyimg.resize({
                    src: saveTo,
                    dst: path.join(appDir, userFile.localPath),
                    width: 250, height: 250
                }).then(
                    function(image) {
                        console.log('Resized: ' + image.width + ' x ' + image.height);
                    },
                    function (err) {
                        console.log(err);
                    }
                );
                res.writeHead(200, { 'Connection': 'close' });
                res.end("Well done!");
            });
        });
        return req.pipe(busboy);
    });

};

