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
            'url': ''
        })
        .config(appConfig)
        .run(runAppConfig);

    appConfig.$inject = [
        'Settings',
        '$urlRouterProvider',
        '$ionicConfigProvider',
        'localStorageServiceProvider'
    ];
    function appConfig(Settings, $urlRouterProvider, $ionicConfigProvider, localStorageServiceProvider) {
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.views.swipeBackEnabled(false);

        $urlRouterProvider.otherwise('/splash');

        localStorageServiceProvider.setPrefix('papirux');

        // RestangularProvider.setBaseUrl(Settings.url);
        // RestangularProvider.setDefaultHttpFields({cache: false});
        // RestangularProvider.setDefaultHeaders({
        //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        // });
    }

    runAppConfig.$inject = [
        '$log',
        'Settings'
    ];

    function runAppConfig($log, Settings) {
        // Restangular.setBaseUrl(Settings.url); //jshint ignore:line
        // Restangular.setErrorInterceptor(function (response) {
        //     $log.debug(response);
        //     return true;
        // });
    }
})();
