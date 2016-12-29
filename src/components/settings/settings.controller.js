(function () {
    'use strict';
    angular
        .module('app.settings')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['userService', '$ionicPopup', 'localStorageService'];
    function SettingsCtrl(userService, $ionicPopup, localStorageService) {
        var vm = this;
        vm.user = localStorageService.get('user');

        vm.hideProfile = hideProfile;
        vm.deleteAccount = deleteAccount;

        vm.settingsUpdate = settingsUpdate;

        function settingsUpdate(data) {
            var options = {};
            if (data.email) {
                options.email = data.email;
            }
            if (data.password) {
                options.password = data.password;
            }
            userService.userPUT(options).then(function (res) {
                vm.user = res;
            });
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
