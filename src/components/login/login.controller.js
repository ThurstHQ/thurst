(function () {
    'use strict';
    angular
        .module('app.login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$state', 'loginService', 'analyticService', 'notificationsService'];
    function LoginCtrl($state, loginService, analyticService, notificationsService) {
        var vm = this;

        vm.login = login;

        function login(user) {
            loginService.loginPOST(user).then(function (res) {
                if (res.success) {
                    analyticService.trackEvent('login', 'status', 'success');
                    if (!res.verify) {
                        analyticService.trackEvent('login', 'status', 'verification');
                        notificationsService.hide();
                        $state.go('verification', {id: res.id, email: user.email});
                    }
                } else {
                    analyticService.trackEvent('login', 'status', 'error');
                    $state.go('error');
                }
            });
        }
    }
})();
