(function () {
    'use strict';
    angular
        .module('app.settings')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['userService', '$ionicPopup', 'localStorageService', 'changePasswordService'];
    function SettingsCtrl(userService, $ionicPopup, localStorageService, changePasswordService) {
        var vm = this;
        vm.user = localStorageService.get('user');

        vm.passwordUpdate = passwordUpdate;
        vm.hideProfile = hideProfile;
        vm.deleteAccount = deleteAccount;

        function passwordUpdate(data) {
            changePasswordService.changePasswordPOST(data);
        }

        function hideProfile() {
            userService.userPUT({invisible: !vm.user.invisible}).then(function (res) {
                vm.user = res;
            });
        }

        function deleteAccount() {
            $ionicPopup.confirm({
                title: 'Are you sure you want delete account?'
            }).then(function (res) {
                if (res) {
                    userService.userDELETE();
                }
            });
        }
    }
})();
