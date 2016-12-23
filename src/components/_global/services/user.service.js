(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('userService', userService);

    userService.$inject = ['Restangular', 'localStorageService', 'notificationsService'];

    function userService(Restangular, localStorageService, notificationsService) {
        return {
            user: Restangular.service('api/user'),
            userGET: function () {
                return this.user.one().get().then(function (res) {
                    localStorageService.set('user', res.data);
                    return res;
                }, function (error) {
                    notificationsService.warn(error.msg);
                    return error;
                });
            },
            userPUT: function (data) {
                return this.user.one().put(null, data).then(function (res) {
                    localStorageService.set('user', res.data);
                    return res;
                }, function (error) {
                    notificationsService.warn(error.msg);
                    return error;
                });
            }
        };
    }
})();
