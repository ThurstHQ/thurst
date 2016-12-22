(function () {
    'use strict';
    angular
        .module('app', [
            'app.config',
            'app.splash',
            'app.login',
            'app.verification',
            'app.error',
            'app.menu',
            'app.profile',
            'app.settings',
            'app.support',
            'app.connections',
            'app.messages'
        ])
        .run(bootstrap);

    bootstrap.$inject = [
        'localStorageService',
        '$state'
    ];

    function bootstrap(localStorageService, $state) {
        setTimeout(function () {
            if (localStorageService.get('token')) {
                $state.go('app.messages');
            } else {
                $state.go('login');
            }
        }, 1500);
    }
})();
