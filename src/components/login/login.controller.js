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
            loginService.login(user).then(function (res) {
                if (res) {
                    $state.go('verification', {id: res.id});
                } else {
                    $state.go('messages');
                }
            }, function (error) {
                $state.go('error');
            });
        }
    }
})();
