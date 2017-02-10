(function () {
    'use strict';
    angular
        .module('app.config', [
            'ionic',
            'ui.router',
            'restangular',
            'LocalStorageModule',
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
        'RestangularProvider'
    ];
    function appConfig($ionicConfigProvider, $locationProvider, Settings, RestangularProvider) {
        $locationProvider.hashPrefix('');
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.views.swipeBackEnabled(false);

        RestangularProvider.setBaseUrl(Settings.url);

        // AnalyticsProvider.setAccount('UA-89420914-1');
        // AnalyticsProvider.setHybridMobileSupport(true);
        // AnalyticsProvider.logAllCalls(true);
        // AnalyticsProvider.setAccount({
        //     tracker: 'UA-89420914-1',
        //     trackEvent: true
        // });
        // AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    }

    runAppConfig.$inject = [
        'Settings',
        'localStorageService',
        '$location',
        'Restangular',
        '$rootScope',
        'profileService',
        'notificationsService',
        'analyticService'
    ];
    function runAppConfig(Settings, localStorageService, $location, Restangular, $rootScope, profileService, notificationsService, analyticService) {
        var push = {}, deviceToken = '';

        $location.path('/');

        document.addEventListener('deviceready', function () {
            window.ga.startTrackerWithId('UA-89420914-1');

            push = window.PushNotification.init({
                android: {
                    senderID: '237624027674'
                },
                ios: {
                    alert: 'true',
                    badge: true,
                    sound: 'false'
                }
            });


            push.on('registration', function (data) {
                deviceToken = data.registrationId;
            });

            push.on('error', function (e) {
                console.log('push error', e);
            });

            if (window.HelpshiftPlugin) {
                window.HelpshiftPlugin.install(Settings.helpshift_key, Settings.helpshift_domain, Settings.helpshift_app_id); //jshint ignore:line
            }

            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                window.cordova.plugins.Keyboard.disableScroll(true);
            }
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, params) {
            if (window.cordova && window.ga) {
                window.ga.trackView(toState.url, JSON.stringify(params));
            }
        });

        Restangular.setErrorInterceptor(function (response) {
            analyticService.trackEvent('setErrorInterceptor', response.config.method + '/' + response.status, response.config.url);
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
                        window.$applozic.fn.applozic({
                            appId: Settings.applozic_key, //jshint ignore:line
                            userId: res._id,
                            userName: res.username,
                            imageLink: res.avatar,
                            email: res.email,
                            desktopNotification: true,
                            notificationIconLink: 'https://www.applozic.com/favicon.ico',
                            onInit: function (response) {
                                if (response === 'success') {
                                    var userPxy = {
                                        'applicationId': Settings.applozic_key, //jshint ignore:line
                                        // Replace APPLICATION_KEY with the Application key received after Signup from https://www.applozic.com/signup.html
                                        'userId': res._id, // Replace USER_ID with the user's unique identifier
                                        'registrationId': deviceToken, //Replace GCM_REGISTRATION_ID with GCM registration id
                                        'pushNotificationFormat': '2',
                                        'deviceType': '1',       //1 for Android, 4 for iOS
                                        'deviceApnsType': '1', //1 for Distribution and 0 for Development APNS Certificate
                                        'appVersionCode': '106'
                                    };

                                    $.ajax({
                                        url: 'https://apps.applozic.com/rest/ws/register/client',
                                        type: 'post',
                                        data: window.JSON.stringify(userPxy),
                                        contentType: 'application/json',
                                        headers: {'Application-Key': Settings.applozic_key},  //jshint ignore:line
                                        // Replace APPLICATION_KEY with the Application key received after Signup from https://www.applozic.com/signup.html
                                        success: function (result) {
                                            console.log(result);
                                        }
                                    });
                                    notificationsService.hide();
                                    $location.path('messages');
                                } else {
                                    notificationsService.warn(response);
                                }
                            }
                        });

                        window.$applozic.fn.applozic('subscribeToEvents', {
                            onConnectFailed: function () {
                                //connection failed
                                analyticService.trackEvent('applozic', 'connectFailed');
                            },
                            onMessageDelivered: function () {
                                //message delivered obj json: {'messageKey': 'delivered-message-key'}
                                analyticService.trackEvent('applozic', 'message', 'messageDelivered');
                            },
                            onMessageRead: function () {
                                //message read obj json: {'messageKey': 'read-message-key'}
                                analyticService.trackEvent('applozic', 'message', 'messageRead');
                            },
                            onMessageReceived: function () {
                                //message received
                                analyticService.trackEvent('applozic', 'message', 'messageReceived');
                            },
                            onMessageSentUpdate: function () {
                                //message sent confirmation: {'messageKey': 'sent-message-key'}
                                analyticService.trackEvent('applozic', 'message', 'messageSentUpdate');
                            },
                            onUserBlocked: function () {
                                //user blocks someone or gets blocked by someone: {'status': 'BLOCKED_TO or BLOCKED_BY', 'userId': userId}
                                analyticService.trackEvent('applozic', 'user', 'blocked');
                            },
                            onUserUnblocked: function () {
                                //user unblocks someone or get unblocked by someone: {'status': 'BLOCKED_TO or BLOCKED_BY', 'userId': userId}
                                analyticService.trackEvent('applozic', 'user', 'unblocked');
                            }
                        });
                        analyticService.setUserId(res._id);
                    } else {
                        notificationsService.hide();
                        $location.path('profile');
                    }
                });
            } else {
                notificationsService.hide();
                $location.path('login');
            }
        }

        $rootScope.$on('login', function (event, token) {
            init(token);
        });

        init(localStorageService.get('token'));
    }
})();
