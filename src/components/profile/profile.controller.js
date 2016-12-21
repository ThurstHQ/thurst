(function () {
    'use strict';
    angular
        .module('app.profile')
        .controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = [];
    function ProfileCtrl() {
        var vm = this;

        vm.logout = logout;
        function logout() {

        }
    }
})();
