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
                    notificationsService.hide();
                    return res;
                }, function (error) {
                    notificationsService.hide();
                    return error;
                });
            },
            verification: function (data) {
                notificationsService.loading();
                return $http.post(Settings.url + 'api/verification', data).then(function (res) {
                    console.log(res);
                    notificationsService.hide();
                }, function (error) {
                    notificationsService.warn(error.msg);
                });
            },
            logout: function () {
                localStorageService.remove('user');
                $state.go('login');
            }
        };
    }
})();
