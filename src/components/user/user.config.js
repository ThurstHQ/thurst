(function () {
    'use strict';
    angular
        .module('app.user', [])
        .config(userConfig);

    userConfig.$inject = [
        '$stateProvider'
    ];
    function userConfig($stateProvider) {
        $stateProvider
            .state('app.user', {
                url: 'user/:id',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'components/user/user.html',
                        controller: 'UserCtrl as vm'
                    }
                },
                resolve: {
                    user: ['userService', '$stateParams', function (userService, $stateParams) {
                        return userService.userGET($stateParams.id);
                    }]
                }
            });
    }
})();
