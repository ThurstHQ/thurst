(function () {
    'use strict';
    angular
        .module('app.config', [
            'ionic',
            'ui.router',
            'LocalStorageModule'
        ])
        .constant('Settings', {
            'applozic_key': 'thurst3f06f50453425773c771235df04b495f5',
            'url': 'http://qa-thurst-back-end-1346444650.us-west-2.elb.amazonaws.com/'
        })
        .config(appConfig)
        .run(runAppConfig);

    appConfig.$inject = [
        '$urlRouterProvider',
        '$ionicConfigProvider',
        'localStorageServiceProvider',
        '$locationProvider',
        '$qProvider'
    ];
    function appConfig($urlRouterProvider, $ionicConfigProvider, localStorageServiceProvider, $locationProvider, $qProvider) {
        $locationProvider.hashPrefix('');
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.views.swipeBackEnabled(false);

        $urlRouterProvider.otherwise('/splash');

        localStorageServiceProvider.setPrefix('papirux');

        $qProvider.errorOnUnhandledRejections(false);
    }

    runAppConfig.$inject = [];

    function runAppConfig() {
    }
})();
