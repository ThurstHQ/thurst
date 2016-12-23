module.exports = function (app, router) {

    var AuthController = require('./auth.controller');

    router.route('/authenticate')
        .post(AuthController.signUp);

    router.route('/verify')
        .post(AuthController.verify);

};