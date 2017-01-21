(function () {
    'use strict';
    angular
        .module('app.config', [
            'ionic',
            'ui.router',
            'restangular',
            'LocalStorageModule',
            'angular-google-analytics',
            'luegg.directives'
        ])
        .constant('Settings', {
            'applozic_key': 'thurst3f06f50453425773c771235df04b495f5',
            'helpshift_key': 'dc2a262b6d251c8c30a952ea00481df6',
            'helpshift_domain': 'thurst.helpshift.com',
            'helpshift_app_id': 'thurst_platform_20161218113708754-98c1e9ed85f48a3',
            'url': 'http://qa-thurst-back-end-1346444650.us-west-2.elb.amazonaws.com/',
            'keyAndroid': ''
        })
        .config(appConfig)
        .run(runAppConfig);

    appConfig.$inject = [
        '$ionicConfigProvider',
        '$locationProvider',
        'Settings',
        'RestangularProvider',
        'AnalyticsProvider'
    ];
    function appConfig($ionicConfigProvider, $locationProvider, Settings, RestangularProvider, AnalyticsProvider) {
        $locationProvider.hashPrefix('');
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.views.swipeBackEnabled(false);


        RestangularProvider.setBaseUrl(Settings.url);

        AnalyticsProvider.setAccount({
            tracker: 'UA-89420914-1',
            trackEvent: true
        });
        AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    }

    runAppConfig.$inject = ['Settings', 'localStorageService', '$location', 'Restangular', '$rootScope', 'profileService', 'notificationsService'];
    function runAppConfig(Settings, localStorageService, $location, Restangular, $rootScope, profileService, notificationsService) {
        $location.path('/');

        if (window.HelpshiftPlugin) {
            window.HelpshiftPlugin.install(Settings.helpshift_key, Settings.helpshift_domain, Settings.helpshift_app_id);
        }

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            window.cordova.plugins.Keyboard.disableScroll(true);
        }

        Restangular.setErrorInterceptor(function (response) {
            if (response.status === 401) {
                localStorageService.clearAll();
                $location.path('login');
                return false;
            }
        });

        function init(token) {
            if (token) {
                Restangular.setDefaultHeaders({'Authorization': token});
                profileService.profileGET().then(function (res) {
                    if (res.username) {
                        $applozic.fn.applozic({
                            appId: Settings.applozic_key,
                            userId: res._id,
                            userName: res.username,
                            imageLink: res.avatar,
                            email: res.email,
                            desktopNotification: true,
                            notificationIconLink: 'https://www.applozic.com/favicon.ico',
                            onInit: function (response) {
                                if (response === "success") {
                                    $location.path('messages');
                                    notificationsService.hide();
                                } else {
                                    notificationsService.warn(response);
                                }
                            }
                        });
                    } else {
                        $location.path('profile');
                    }
                });
            } else {
                $location.path('login');
            }
        }

        $rootScope.$on('login', function (event, token) {
            init(token);
        });

        init(localStorageService.get('token'));
    }
})();
