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
            'helpshift_key': 'dc2a262b6d251c8c30a952ea00481df6',
            'helpshift_domain': 'thurst.helpshift.com',
            'helpshift_app_id': 'thurst_platform_20161218113708754-98c1e9ed85f48a3',
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

    runAppConfig.$inject = ['Settings', '$ionicPlatform'];

    function runAppConfig(Settings, $ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.HelpshiftPlugin) {
                window.HelpshiftPlugin.install(Settings.helpshift_key, Settings.helpshift_domain, Settings.helpshift_app_id);
            }
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                window.cordova.plugins.Keyboard.disableScroll(true);
            }
        });
    }
})();
