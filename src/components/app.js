(function () {
    'use strict';
    angular
        .module('app', [
            'app.config',
            'app.login',
            'app.verification',
            'app.error',
            'app.menu',
            'app.profile',
            'app.settings',
            'app.support',
            'app.connections',
            'app.messages',
            'app.search',
            'app.user'
            // 'app.policy',
            // 'app.terms'
        ])
        .filter('cacheReset', function () {
            return function (input) {
                return input + '?' + Math.random();
            };
        });
})();
