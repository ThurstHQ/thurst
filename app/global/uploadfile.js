var http = require('http'),
    path = require('path'),
    os = require('os'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    randomstring = require('randomstring');


exports.uploadFiles = function (req, res, next) {

    var userId = req.user._id || 'empty userId',
        userIdString = req.user._id.toString();

    if (req.body.avatar) {

        var AWS = require('aws-sdk');
        AWS.config.accessKeyId = process.env.AKI;
        AWS.config.secretAccessKey = process.env.SAK;
        AWS.config.region = "us-west-2";

        var s3Bucket = new AWS.S3( { params: {Bucket: userIdString} } );

        buf = new Buffer(req.body.avatar.replace(/^data:image\/\w+;base64,/, ""),'base64');

        s3Bucket.createBucket({Bucket: userIdString}, function(err, result) {
            if (err) return res.status(500).json(err, err.stack);

            var data = {
                Key: userIdString + '.jpeg',
                Body: buf,
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg',
                ACL: 'public-read'
            };

            s3Bucket.putObject(data, function(err, data){
                if (err) {
                    if (err) return res.status(500).json(err, err.stack);
                } else {
                    res.json({"success": true, "path": "https://s3-us-west-2.amazonaws.com/" + userIdString + '/' + userIdString + '.jpeg'});

                }
            });
        });

        console.log(process.env.AKI);
        console.log(process.env.SAK);


       /* var base64Data = req.body.avatar.replace(/^data:image\/jpeg;base64,/, "");
        console.log();

        mkdirp(pathForSave, function (err) {
            if (err) console.log(err);
            var randomString = randomstring.generate({ length: 4 }),
                pathToImg = path.join(pathForSave, userId.toString() + '-' + randomString + ".jpeg");
            console.log(pathForSave);
            console.log(pathToImg);
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
        })*/
    }

};

