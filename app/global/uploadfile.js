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
                res.end("That's all folks!");
            });
        });
        return req.pipe(busboy);
    });

};

/*
exports.busboyFile = function (req, res, availiableSpace, filePath, uploadType) {
    var fsStream,
        streamData = 0,
        appDir = pathNPM.dirname(require.main.filename);

    if (availiableSpace < parseInt(req.busboy.opts.headers['content-length'])) {
        req.unpipe(req.busboy);
        res.status(500).send('You are exceeding your storage limit for your subscription, please contact your team admin');
        res.end();
    } else {
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            filename = filename.replace(/[\s*+?^${}()|[\]\\]/g, '-');
            var path = {
                name: filename,
                path: pathNPM.join(filePath, filename)
            };

            file.on('data', function(data) {
                streamData += data.length;
                // console.log('- STREAM DATA: ', streamData, '||| availiableSpace: ', availiableSpace);
                if (availiableSpace < streamData) {
                    streamData = -999999999999;
                    req.unpipe(req.busboy);
                    fs.unlink(pathNPM.join(appDir, 'www', path.path), (err) => {
                        if (err) console.log(err.message);
                    console.log('======= successfully deleted');
                });
                    res.writeHead(500, {'Connection': 'close'});
                    res.end('You are exceeding your storage limit for your subscription, please contact your team admin');
                }
            });
            var arrOfFiles = fs.readdirSync(pathNPM.join(appDir, 'www', filePath));
            if (arrOfFiles.length > 0) {
                var isFindFile = _.find(arrOfFiles, function (file) {
                    return file === filename;
                });
                if (isFindFile !== undefined) {
                    var randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                    path.name = path.name.replace('.', '-' + randomNum + '.');
                    path.path = pathNPM.join(filePath, path.name);
                }
            }
            fsStream = fs.createWriteStream(pathNPM.join('www', path.path));
            file.pipe(fsStream);

            file.on('end', function(){
                if (availiableSpace > streamData) {
                    if (req.url.substr(req.url.lastIndexOf('/') + 1) === 'avatar') {
                        gm(__dirname + '/../../www/public/uploads/' + req.user._id + '/' + path.name)
                            .resize(250, 250)
                            .noProfile()
                            .write(__dirname + '/../../www/public/uploads/' + req.user._id + '/' + path.name, function (err) {
                                if (err) return res.status(500).send({message: 'Image was not resized'});
                                res.status(200).json(path);
                            });
                    } else if (uploadType === 3) {
                        if (path.name.split('.').pop() !== 'pdf') {
                            exec('unoconv -f pdf ' + pathNPM.join(appDir, 'www', path.path), function (error, stdout, stderr) {
                                if (error) return console.log(error);
                                var changeFormat = path.name.split('.');
                                // add link for converted .pdf at response
                                path.pdf = 'public/uploads/' + req.user._id + '/' + changeFormat[0] + '.pdf';
                                fs.unlink(pathNPM.join(appDir, 'www', path.path), function (err) {
                                    if (err) { res.status(500).send({message: err.message}); }
                                    res.status(200).json(path);
                                });
                            });
                        } else {
                            path.pdf = path.path;
                            res.status(200).json(path);
                        }
                    } else if (uploadType === 1){
                        gm(pathNPM.join(appDir, 'www', path.path))
                            .resize(600, 600, '>')
                            .noProfile()
                            .write(pathNPM.join(appDir, 'www', path.path), function (err) {
                                if (err) return res.status(500).send({message: err.message});
                                res.status(200).json(path);
                            });
                    } else {
                        res.status(200).json(path);
                    }
                }
            });
            file.on('error', function (err) {
                if (err) return res.status(500).send({message: err.message});
            });
        });
    }
};*/
