(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('userService', userService);

    userService.$inject = ['$http', 'Settings', 'localStorageService', 'notificationsService'];

    function userService($http, Settings, localStorageService, notificationsService) {
        return {
            userGET: function () {
                return $http.get(Settings.url + 'api/user').then(function (res) {
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
