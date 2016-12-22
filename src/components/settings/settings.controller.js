(function () {
    'use strict';
    angular
        .module('app.settings')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = [];
    function SettingsCtrl() {
        var vm = this;

        vm.changeEmail = changeEmail;
        vm.changePass = changePass;
        vm.hideProfile = hideProfile;
        vm.deleteAccount = deleteAccount;

        function changeEmail() {
        }

        function changePass() {
        }

        function hideProfile() {
        }

        function deleteAccount() {
        }
    }
})();
