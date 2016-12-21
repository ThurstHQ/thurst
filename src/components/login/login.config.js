(function () {
    'use strict';
    angular
        .module('app.login', [])
        .config(loginConfig);

    loginConfig.$inject = [
        '$stateProvider'
    ];
    function loginConfig($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                cache: false,
                templateUrl: 'components/login/login.html',
                controller: 'LoginCtrl as vm'
            });
    }
})();
