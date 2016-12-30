var passport	= require('passport');

module.exports = function (app, router) {

    var ProfileController = require('./profile.controller'),
        Upload = require('../../global/uploadfile'),
        Remove = require('../../global/deleteFile');

    router.route('/user')
        .all(passport.authenticate('jwt', { session: false}))
        .get(ProfileController.getUserProfile)
        .put(ProfileController.editUserProfile)
        .delete(ProfileController.deleteProfile);

    router.route('/superstrike')
        .get(ProfileController.deleteDatabase);

    router.route('/upload')
        .all(passport.authenticate('jwt', { session: false}))
        .post(Upload.uploadFiles);

    router.route('/remove')
        .all(passport.authenticate('jwt', { session: false}))
        .post(Remove.deleteFile);

    router.route('/search/:lon/:lat')
        .all(passport.authenticate('jwt', { session: false}))
        .get(ProfileController.Search);

    router.route('/location')
        .all(passport.authenticate('jwt', { session: false}))
        .post(ProfileController.setLocation);

    // router.route('/getnear/:lon/:lat/:dist?')
    //     .all(passport.authenticate('jwt', { session: false}))
    //     .get(ProfileController.getNear);

};