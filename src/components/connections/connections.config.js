(function () {
    'use strict';
    angular
        .module('app.connections', [])
        .config(connectionsConfig);

    connectionsConfig.$inject = [
        '$stateProvider'
    ];
    function connectionsConfig($stateProvider) {
        $stateProvider
            .state('app.connections', {
                cache: false,
                url: 'connections',
                views: {
                    'menuContent': {
                        templateUrl: 'components/connections/connections.html',
                        controller: 'ConnectionsCtrl as vm'
                    }
                }
            });
    }
})();
