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

    runAppConfig.$inject = ['Settings', 'localStorageService', '$location', 'Restangular', '$rootScope', 'locationService', 'profileService', 'notificationsService'];

    function runAppConfig(Settings, localStorageService, $location, Restangular, $rootScope, locationService, profileService, notificationsService) {

        var token = localStorageService.get('token');

        if (token) {
            init(token);
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

        if (window.PushNotification) {
            var push = window.PushNotification.init({
                android: {
                    senderID: Settings.keyAndroid
                },
                ios: {
                    alert: true,
                    badge: true,
                    sound: true,
                    clearBadge: true
                }
            });
            push.on('registration', function (data) {
                // authenticationService.notificationPOST({
                //     uuid: window.device.uuid,
                //     notify_id: data.registrationId //jshint ignore:line
                // });
                localStorageService.set('pushToken', data.registrationId);
            });
            push.on('notification', function (data) {
                console.log(data);
            });
            push.on('error', function (e) {
                console.log(e.message);
            });
        }

        function init(token) {
            Restangular.setDefaultHeaders({'Authorization': token});
            profileService.profileGET().then(function (res) {
                if (res.username) {
                    initApplozic(res);
                    $location.path('messages');
                } else {
                    $location.path('profile');
                }
                if (res.loc) {
                    initGeo(res);
                }
            });
        }

        function initGeo(res) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                locationService.updateLocationPOST({
                    longitude: pos.coords.longitude,
                    latitude: pos.coords.latitude
                },res);
            });
        }

        function initApplozic(profile) {
            $applozic.fn.applozic({
                appId: Settings.applozic_key,   //Get your application key from https://www.applozic.com
                userId: profile._id,               //Logged in user's id, a unique identifier for user
                userName: profile.username,            //User's display name
                imageLink: profile.avatar,                  //User's profile picture url
                email: profile.email,
                desktopNotification: true,
                notificationIconLink: 'https://www.applozic.com/favicon.ico',   //Icon to show in desktop notification, replace with your icon
                // authenticationTypeId: '0',      //1 for password verification from Applozic server and 0 for access Token verification from your server
                // accessToken: '',                //optional, leave it blank for testing purpose, read this if you want to add additional security by verifying password from your server https://www.applozic.com/docs/configuration.html#access-token-url
                onInit: function (response) {
                    if (response === "success") {
                        getProfileDetail();
                    } else {
                        notificationsService.warn(response);
                    }
                }
            });
        }

        function getProfileDetail() {
            $applozic.fn.applozic('getUserDetail', {
                callback: function getUserDetail(response) {
                    if (response.status === 'success') {
                        $rootScope.messages = response.data.users;
                    }
                }
            });
        }

        Restangular.setErrorInterceptor(function (response) {
            if (response.status === 401) {
                localStorageService.clearAll();
                $location.path('login');
                return false;
            }
        });

        $rootScope.$on('initApplozic', function (event, profile) {
            initApplozic(profile);
        });
        $rootScope.$on('initGeo', function (event, profile) {
            initGeo(profile);
        });
        $rootScope.$on('getProfileDetail', function () {
            getProfileDetail();
        });
        $rootScope.$on('login', function (event, token) {
            init(token);
        });
    }
})();
