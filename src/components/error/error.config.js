(function () {
    'use strict';
    angular
        .module('app.error', [])
        .config(errorConfig);

    errorConfig.$inject = [
        '$stateProvider'
    ];
    function errorConfig($stateProvider) {
        $stateProvider
            .state('error', {
                url: '/error',
                cache: false,
                templateUrl: 'components/error/error.html'
            });
    }
})();
