(function () {
    'use strict';
    angular
        .module('app.terms', [])
        .config(termsConfig);

    termsConfig.$inject = [
        '$stateProvider'
    ];
    function termsConfig($stateProvider) {
        $stateProvider
            .state('app.terms', {
                url: 'settings/terms',
                views: {
                    'menuContent': {
                        templateUrl: 'components/terms/terms.html',
                        controller: 'TermsCtrl as vm'
                    }
                },
                resolve: {
                    data: ['pagesService', function (pagesService) {
                        return pagesService.termsGET();
                    }]
                }
            });
    }
})();
