var passport	= require('passport');

module.exports = function (app, router) {

    var AuthController = require('./auth.controller');

    router.route('/authenticate')
        .post(AuthController.signUp);

    router.route('/verify')
        .post(AuthController.verify);

    router.route('/chngpwd')
        .all(passport.authenticate('jwt', { session: false}))
        .post(AuthController.changePass);

};