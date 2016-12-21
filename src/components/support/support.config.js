(function () {
    'use strict';
    angular
        .module('app.support', [])
        .config(supportConfig);

    supportConfig.$inject = [
        '$stateProvider'
    ];
    function supportConfig($stateProvider) {
        $stateProvider
            .state('app.support', {
                cache: false,
                url: 'support',
                views: {
                    'menuContent': {
                        templateUrl: 'components/support/support.html',
                        controller: 'SupportCtrl as vm'
                    }
                }
            });
    }
})();
