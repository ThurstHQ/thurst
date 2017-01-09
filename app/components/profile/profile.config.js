var passport	= require('passport');

module.exports = function (app, router) {

    var ProfileController = require('./profile.controller'),
        Upload = require('../../global/uploadfile'),
        Remove = require('../../global/deleteFile');

    router.route('/profile')
        .all(passport.authenticate('jwt', { session: false}))
        .get(ProfileController.getUserProfile)
        .put(ProfileController.editUserProfile)
        .delete(ProfileController.deleteProfile);

    // router.route('/user/:id')
    //     .all(passport.authenticate('jwt', { session: false}))
    //     .get(ProfileController.getUserProfile);

    router.route('/superstrike')
        .get(ProfileController.deleteDatabase);

    router.route('/upload')
        .all(passport.authenticate('jwt', { session: false}))
        .post(Upload.uploadFiles);

    router.route('/remove')
        .all(passport.authenticate('jwt', { session: false}))
        .post(Remove.deleteFile);

    router.route('/search')
        .all(passport.authenticate('jwt', { session: false}))
        .get(ProfileController.Search);

    router.route('/location')
        .all(passport.authenticate('jwt', { session: false}))
        .post(ProfileController.setLocation);

    router.route('/connections')
        .all(passport.authenticate('jwt', { session: false}))
        .post(ProfileController.setConnections)
        .get(ProfileController.getConnections)
        .delete(ProfileController.deleteConnections);

    router.route('/ddd')
        .get(ProfileController.ddd)
};