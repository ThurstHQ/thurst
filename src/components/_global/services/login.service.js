(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('loginService', loginService);

    loginService.$inject = ['Restangular', '$state', 'Settings', 'notificationsService', 'localStorageService'];

    function loginService(Restangular, $state, Settings, notificationsService, localStorageService) {
        return {
            login: function (data) {
                notificationsService.loading();
                return Restangular.one('api/authenticate').post(null, data).then(function (res) {
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
                return Restangular.one('api/verify').post(null, data).then(function (res) {
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
