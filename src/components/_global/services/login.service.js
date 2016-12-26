(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('loginService', loginService);

    loginService.$inject = ['Restangular', '$state', 'notificationsService', 'localStorageService', '$rootScope'];

    function loginService(Restangular, $state, notificationsService, localStorageService, $rootScope) {
        return {
            login: function (data) {
                notificationsService.loading();
                return Restangular.one('api/authenticate').post(null, data).then(function (res) {
                    if (res.token) {
                        $rootScope.$emit('token', res.token);
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
                    if (res.token) {
                        $rootScope.$emit('token', res.token);
                    }
                    notificationsService.hide();
                    return res;
                }, function (error) {
                    notificationsService.warn(error.msg);
                    return error;
                });
            },
            logout: function () {
                localStorageService.clearAll();
                $state.go('login');
            }
        };
    }
})();
