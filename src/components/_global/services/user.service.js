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
            },
            userPUT: function (data) {
                return $http.put(Settings.url + 'api/user', data).then(function (res) {
                    localStorageService.set('user', res.data);
                    return res;
                }, function (error) {
                    notificationsService.warn(error.msg);
                    return error;
                });
            },
            setPhoto: function (data) {
                notificationsService.loading();
                return $http.post(Settings.url + 'api/upload', data).then(function (res) {
                    notificationsService.hide();
                    return res;
                }, function (error) {
                    notificationsService.hide();
                    notificationsService.warn(error.msg);
                    return error;
                });
            }
        };
    }
})();
