var passport	= require('passport');

module.exports = function (app, router) {

    var ProfileController = require('./profile.controller'),
        Upload = require('../../global/uploadfile');

    router.route('/user')
        .all(passport.authenticate('jwt', { session: false}))
        .get(ProfileController.getUserProfile);

    // router.route('/user')
    //     .all(passport.authenticate('jwt', { session: false}))
    //     .put(ProfileController.updateUserProfile);

    router.route('/upload')
        .all(passport.authenticate('jwt', { session: false}))
        .post(Upload.uploadFiles);

};