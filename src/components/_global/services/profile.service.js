(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('profileService', profileService);

    profileService.$inject = ['Restangular', 'localStorageService', 'notificationsService', 'loginService', '$rootScope', 'Settings'];

    function profileService(Restangular, localStorageService, notificationsService, loginService, $rootScope, Settings) {
        return {
            profile: Restangular.service('api/profile'),
            profileGET: function () {
                return this.profile.one().get().then(function (res) {
                    if (res.avatar) {
                        res.avatar = res.avatar;
                    }
                    localStorageService.set('profile', res);
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            },
            profilePUT: function (data) {
                notificationsService.loading();
                return this.profile.one().customPUT(data).then(function (res) {
                    if (res.avatar) {
                        res.avatar = res.avatar;
                    }
                    localStorageService.set('profile', res);
                    if (res.username && res.sexuality && res.gender) {
                        $rootScope.$emit('initApplozic', res);
                    }
                    notificationsService.show('Saved');
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            },
            profileDELETE: function () {
                notificationsService.loading();
                this.profile.one().customDELETE().then(function (res) {
                    notificationsService.hide();
                    loginService.logout();
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            }
        };
    }
})();
