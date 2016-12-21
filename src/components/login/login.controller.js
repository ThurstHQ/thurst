(function () {
    'use strict';
    angular
        .module('app.login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = [];
    function LoginCtrl() {
        var vm = this;

        vm.login = login;

        function login(user) {
            console.log(user);
        }
    }
})();
