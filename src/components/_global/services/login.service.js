(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('loginService', loginService);

    loginService.$inject = ['Restangular', '$state', 'notificationsService', 'localStorageService', '$rootScope', 'analyticService'];

    function loginService(Restangular, $state, notificationsService, localStorageService, $rootScope, analyticService) {
        return {
            verify: function (res, email) {
                if (res.verify) {
                    localStorageService.set('token', res.token);
                    $rootScope.$emit('login', res.token);
                } else {
                    notificationsService.hide();
                    $state.go('verification', {id: res.id, email: email});
                }
            },
            loginPOST: function (data) {
                var me = this;
                notificationsService.loading();
                return Restangular.one('api/authenticate').post(null, data).then(function (res) {
                    analyticService.trackEvent('login', 'status', 'success');
                    me.verify(res, data.email);
                    return res;
                }, function () {
                    analyticService.trackEvent('login', 'status', 'error');
                    notificationsService.hide();
                    $state.go('error');
                    return false;
                });
            },
            verifyPOST: function (data) {
                notificationsService.loading();
                var me = this;
                return Restangular.one('api/verify').post(null, data).then(function (res) {
                    me.verify(res);
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return false;
                });
            },
            forgotPOST: function (data) {
                if (data.password) {
                    notificationsService.loading();
                    var me = this;
                    return Restangular.one('api/forgot').post(null, data).then(function (res) {
                        me.verify(res);
                        return res;
                    }, function (error) {
                        notificationsService.warn(error.data.message);
                        return false;
                    });
                } else {
                    notificationsService.warn('Passwords do not match');
                }
            },
            forgotEmailPOST: function (data) {
                notificationsService.loading();
                return Restangular.one('api/forgotemail').post(null, data).then(function (res) {
                    notificationsService.hide();
                    return res.success;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return false;
                });
            },
            forgotCodePOST: function (data) {
                notificationsService.loading();
                return Restangular.one('api/forgotcode').post(null, data).then(function (res) {
                    notificationsService.hide();
                    return res.success;
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
