(function () {
    'use strict';
    angular
        .module('app.search', [])
        .config(searchConfig);

    searchConfig.$inject = [
        '$stateProvider'
    ];
    function searchConfig($stateProvider) {
        $stateProvider
            .state('app.search', {
                url: 'search',
                views: {
                    'menuContent': {
                        templateUrl: 'components/search/search.html',
                        controller: 'SearchCtrl as vm'
                    }
                }
            });
    }
})();
