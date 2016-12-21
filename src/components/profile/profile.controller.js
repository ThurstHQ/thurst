(function () {
    'use strict';
    angular
        .module('app.profile')
        .controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = ['loginService'];
    function ProfileCtrl(loginService) {
        var vm = this;

        vm.logout = logout;
        function logout() {
            loginService.logout();
        }
    }
})();
