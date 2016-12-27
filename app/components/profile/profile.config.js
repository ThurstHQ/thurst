var passport	= require('passport');

module.exports = function (app, router) {

    var ProfileController = require('./profile.controller'),
        Upload = require('../../global/uploadfile');

    router.route('/user')
        .all(passport.authenticate('jwt', { session: false}))
        .get(ProfileController.getUserProfile)
        .put(ProfileController.editUserProfile)
        .delete(ProfileController.deleteProfile);

    router.route('/superstrike')
        .all(passport.authenticate('jwt', { session: false}))
        .get(ProfileController.deleteDatabase);

    router.route('/upload')
        .all(passport.authenticate('jwt', { session: false}))
        .post(Upload.uploadFiles);

    router.route('/search')
        .all(passport.authenticate('jwt', { session: false}))
        .get(ProfileController.Search);

};