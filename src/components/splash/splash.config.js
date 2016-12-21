(function () {
    'use strict';
    angular
        .module('app.splash', [])
        .config(splashConfig);

    splashConfig.$inject = [
        '$stateProvider'
    ];
    function splashConfig($stateProvider) {
        $stateProvider
            .state('splash', {
                url: '/splash',
                cache: false,
                templateUrl: 'components/splash/splash.html'
            });
    }
})();
