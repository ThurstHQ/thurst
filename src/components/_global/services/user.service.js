(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('userService', userService);

    userService.$inject = ['Restangular', 'localStorageService', 'notificationsService', 'loginService'];

    function userService(Restangular, localStorageService, notificationsService, loginService) {
        return {
            user: Restangular.service('api/user'),
            userGET: function () {
                return this.user.one().get().then(function (res) {
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
                    localStorageService.set('user', res);
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
