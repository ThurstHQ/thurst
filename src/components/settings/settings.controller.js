(function () {
    'use strict';
    angular
        .module('app.settings')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['profileService', '$ionicPopup', 'localStorageService', 'changePasswordService', 'analyticService'];
    function SettingsCtrl(profileService, $ionicPopup, localStorageService, changePasswordService, analyticService) {
        var vm = this;
        vm.profile = localStorageService.get('profile');

        vm.passwordUpdate = passwordUpdate;
        vm.hideProfile = hideProfile;
        vm.deleteAccount = deleteAccount;

        function passwordUpdate(data) {
            changePasswordService.changePasswordPOST(data).then(function (res) {
                analyticService.trackEvent('settings', 'password', 'updated');
                if (res.success) {
                    vm.password = {
                        password: '',
                        newpassword: ''
                    };
                    vm.confirm = '';
                }
            });
        }

        function hideProfile() {
            profileService.profilePUT({invisible: !vm.profile.invisible}).then(function (res) {
                analyticService.trackEvent('settings', 'visible', !vm.profile.invisible);
                vm.profile = res;
            });
        }

        function deleteAccount() {
            $ionicPopup.confirm({
                title: 'Are you sure you want delete account?'
            }).then(function (res) {
                if (res) {
                    analyticService.trackEvent('settings', 'account-deleted');
                    profileService.profileDELETE();
                }
            });
        }
    }
})();
