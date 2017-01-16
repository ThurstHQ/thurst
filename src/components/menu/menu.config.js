(function () {
    'use strict';
    angular
        .module('app.menu', [])
        .config(menuConfig);

    menuConfig.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];
    function menuConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/messages');

        $stateProvider
            .state('app', {
                url: '/',
                abstract: true,
                templateUrl: 'components/menu/menu.html',
                controller: 'MenuCtrl as vm',
                resolve: {
                    connections: ['connectionsService', function (connectionsService) {
                        return connectionsService.connectionsGET();
                    }]
                }
            });
    }
})();
