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
            'url': 'http://qa-thurst-back-end-1346444650.us-west-2.elb.amazonaws.com/'
        })
        .config(appConfig)
        .run(runAppConfig);

    appConfig.$inject = [
        '$ionicConfigProvider',
        '$locationProvider',
        '$qProvider',
        'Settings',
        'RestangularProvider',
        'AnalyticsProvider'
    ];
    function appConfig($ionicConfigProvider, $locationProvider, $qProvider, Settings, RestangularProvider, AnalyticsProvider) {
        $locationProvider.hashPrefix('');
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.views.swipeBackEnabled(false);

        $qProvider.errorOnUnhandledRejections(false);

        RestangularProvider.setBaseUrl(Settings.url);

        AnalyticsProvider.setAccount({
            tracker: 'UA-89420914-1',
            trackEvent: true
        });
        AnalyticsProvider.setPageEvent('$stateChangeSuccess');

    }

    runAppConfig.$inject = ['Settings', 'localStorageService', '$location', 'Restangular', '$rootScope'];

    function runAppConfig(Settings, localStorageService, $location, Restangular, $rootScope) {
        console.log('appconfig');

        var token = localStorageService.get('token');

        if (token) {
            Restangular.setDefaultHeaders({'Authorization': token});
            $location.path('messages');
        } else {
            $location.path('login');
        }
        if (window.HelpshiftPlugin) {
            window.HelpshiftPlugin.install(Settings.helpshift_key, Settings.helpshift_domain, Settings.helpshift_app_id);
        }
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            window.cordova.plugins.Keyboard.disableScroll(true);
        }

        $rootScope.$on('initApplozic', function (event, user) {
            $applozic.fn.applozic({
                appId: Settings.applozic_key,   //Get your application key from https://www.applozic.com
                userId: user._id,               //Logged in user's id, a unique identifier for user
                userName: user.username,            //User's display name
                imageLink: user.avatar,                  //User's profile picture url
                email: user.email,
                // contactNumber: '',              //optional, pass with internationl code eg: +16508352160
                // desktopNotification: true,
                // notificationIconLink: 'https://www.applozic.com/favicon.ico',   //Icon to show in desktop notification, replace with your icon
                // authenticationTypeId: '0',      //1 for password verification from Applozic server and 0 for access Token verification from your server
                // accessToken: '',                //optional, leave it blank for testing purpose, read this if you want to add additional security by verifying password from your server https://www.applozic.com/docs/configuration.html#access-token-url
                onInit: function (response) {
                    if (response === "success") {
                        $applozic.fn.applozic('getUserDetail', {
                            callback: function getUserDetail(response) {
                                if (response.status === 'success') {
                                    console.log('getUserDetail', response.data);
                                    // vm.chats = response.data.users;
                                }
                            }
                        });
                        $applozic.fn.applozic('loadTab', 1);
                    } else {
                        // error in user login/register (you can hide chat button or refresh page)
                    }
                },
                contactDisplayName: function (id) {
                    console.log('contactDisplayName', id);
                    //return the display name of the user from your application code based on userId.
                    return "";
                },
                contactDisplayImage: function (id) {
                    console.log('contactDisplayImage', id);
                    //return the display image url of the user from your application code based on userId.
                    return "";
                }
            });
        });
    }
})();
