(function () {
    'use strict';
    angular
        .module('app.login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['loginService'];
    function LoginCtrl(loginService) {
        var vm = this;

        vm.login = login;
        function login(user) {
            loginService.loginPOST(user);
        }
    }
})();
