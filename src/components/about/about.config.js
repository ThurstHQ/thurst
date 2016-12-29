(function () {
    'use strict';
    angular
        .module('app.about', [])
        .config(aboutConfig);

    aboutConfig.$inject = [
        '$stateProvider'
    ];
    function aboutConfig($stateProvider) {
        $stateProvider
            .state('app.about', {
                url: 'settings/about',
                views: {
                    'menuContent': {
                        templateUrl: 'components/about/about.html',
                        controller: 'AboutCtrl as vm'
                    }
                },
                resolve: {
                    data: ['pagesService', function (pagesService) {
                        return pagesService.aboutGET();
                    }]
                }
            });
    }
})();
