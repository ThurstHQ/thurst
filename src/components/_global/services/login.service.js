(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('loginService', loginService);

    loginService.$inject = ['$state', 'notificationsService', 'localStorageService'];

    function loginService($state, notificationsService, localStorageService) {
        return {
            login: function (user) {
                notificationsService.loading();
            },
            logout: function () {
                localStorageService.remove('user');
                $state.go('login');
            }
        };
    }
})();
