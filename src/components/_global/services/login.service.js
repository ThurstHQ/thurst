(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('loginService', loginService);

    loginService.$inject = ['$http', '$state', 'Settings', 'notificationsService', 'localStorageService'];

    function loginService($http, $state, Settings, notificationsService, localStorageService) {
        return {
            login: function (data) {
                notificationsService.loading();
                return $http.post(Settings.url + 'api/authenticate', data).then(function (res) {
                    if (res.data.token) {
                        localStorageService.set('token', res.data.token);
                    }
                    notificationsService.hide();
                    return res;
                }, function (error) {
                    notificationsService.hide();
                    return error;
                });
            },
            verification: function (data) {
                notificationsService.loading();
                return $http.post(Settings.url + 'api/verify', data).then(function (res) {
                    localStorageService.set('token', res.data.token);
                    notificationsService.hide();
                    return res;
                }, function (error) {
                    notificationsService.warn(error.msg);
                    return error;
                });
            },
            logout: function () {
                localStorageService.remove('token');
                $state.go('login');
            }
        };
    }
})();
