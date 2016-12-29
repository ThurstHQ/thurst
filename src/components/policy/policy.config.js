(function () {
    'use strict';
    angular
        .module('app.policy', [])
        .config(policyConfig);

    policyConfig.$inject = [
        '$stateProvider'
    ];
    function policyConfig($stateProvider) {
        $stateProvider
            .state('app.policy', {
                url: 'settings/policy',
                views: {
                    'menuContent': {
                        templateUrl: 'components/policy/policy.html',
                        controller: 'PolicyCtrl as vm'
                    }
                },
                resolve: {
                    data: ['pagesService', function (pagesService) {
                        return pagesService.policyGET();
                    }]
                }
            });
    }
})();
