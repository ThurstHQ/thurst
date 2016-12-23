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
            loginService.login(user).then(function (res) {
                if (res.success) {
                    if (res.newuser) {
                        $state.go('verification', {id: res.id});
                    } else {
                        $state.go('app.messages');
                    }
                } else {
                    $state.go('error');
                }
            });
        }
    }
})();
