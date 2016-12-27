var fsExtra = require('fs-extra');

exports.deleteFile = function (req, res, next) {
    var path = req.body.path,
        regexId = new RegExp(req.user._id, 'i');
    if (regexId.test(req.body.path)) {
        fsExtra.remove(path, function (err, data) {
            if (err) return res.json({message: err.message});
            return res.json({success: true, message: "File successfully deleted."})
        })
    } else {
        return res.status(500).json({message: "You can't delete this files."})
    }

};

