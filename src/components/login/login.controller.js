(function () {
    'use strict';
    angular
        .module('app.login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$state', 'loginService'];
    function LoginCtrl($state, loginService) {
        var vm = this;

        vm.login = login;

        function login(user) {
            loginService.loginPOST(user).then(function (res) {
                if (res.success) {
                    if (!res.verify) {
                        $state.go('verification', {id: res.id, email: user.email});
                    }
                } else {
                    $state.go('error');
                }
            });
        }
    }
})();
