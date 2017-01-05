(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('userService', userService);

    userService.$inject = ['Restangular', 'localStorageService', 'notificationsService', 'loginService', '$rootScope', 'Settings'];

    function userService(Restangular, localStorageService, notificationsService, loginService, $rootScope, Settings) {
        return {
            user: Restangular.service('api/user'),
            userGET: function () {
                return this.user.one().get().then(function (res) {
                    if (res.avatar) {
                        res.avatar = Settings.url + res.avatar;
                    }
                    localStorageService.set('user', res);
                    return res;
                }, function (error) {
                    notificationsService.warn(error.msg);
                    return error;
                });
            },
            userPUT: function (data) {
                notificationsService.loading();
                return this.user.one().customPUT(data).then(function (res) {
                    if (res.avatar) {
                        res.avatar = Settings.url + res.avatar;
                    }
                    localStorageService.set('user', res);
                    if (res.username && res.sexuality && res.gender) {
                        $rootScope.$emit('initApplozic', res);
                    }
                    notificationsService.hide();
                    return res;
                }, function (error) {
                    notificationsService.hide();
                    notificationsService.warn(error.msg);
                    return error;
                });
            },
            userDELETE: function () {
                notificationsService.loading();
                this.user.one().customDELETE().then(function (res) {
                    notificationsService.hide();
                    loginService.logout();
                    return res;
                }, function (error) {
                    notificationsService.hide();
                    return error;
                });
            }
        };
    }
})();
