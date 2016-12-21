(function () {
    'use strict';
    angular
        .module('app.profile', [])
        .config(profileConfig);

    profileConfig.$inject = [
        '$stateProvider'
    ];
    function profileConfig($stateProvider) {
        $stateProvider
            .state('app.profile', {
                url: 'profile',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'components/profile/profile.html',
                        controller: 'ProfileCtrl as vm'
                    }
                }
            });
    }
})();
