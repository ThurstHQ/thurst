(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('loginService', loginService);

    loginService.$inject = ['Restangular', '$state', 'notificationsService', 'localStorageService', '$rootScope'];

    function loginService(Restangular, $state, notificationsService, localStorageService, $rootScope) {
        return {
            loginPOST: function (data) {
                notificationsService.loading();
                return Restangular.one('api/authenticate').post(null, data).then(function (res) {
                    if (res.token) {
                        localStorageService.set('token', res.token);
                        $rootScope.$emit('login', res.token);
                    }
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            },
            verificationPOST: function (data) {
                notificationsService.loading();
                return Restangular.one('api/verify').post(null, data).then(function (res) {
                    if (res.token) {
                        localStorageService.set('token', res.token);
                        $rootScope.$emit('login', res.token);
                    }
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return false;
                });
            },
            logout: function () {
                localStorageService.clearAll();
                $state.go('login');
            }
        };
    }
})();
