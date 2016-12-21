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
        '$ionicPlatform',
        '$state'
    ];

    function bootstrap(localStorageService, $ionicPlatform, $state) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                window.cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                window.StatusBar.styleDefault();
                window.open = window.cordova.InAppBrowser.open;
            }
            if (window.FCMPlugin) {
                window.FCMPlugin.onNotification(function (data) {
                    if (data.wasTapped) {
                        //Notification was received on device tray and tapped by the user.
                        alert(JSON.stringify(data));
                    } else {
                        //Notification was received in foreground. Maybe the user needs to be notified.
                        alert(JSON.stringify(data));
                    }
                }, function (msg) {
                    console.log('onNotification callback successfully registered: ' + msg);
                }, function (err) {
                    console.log('Error registering onNotification callback: ' + err);
                });
            }
        });

        setTimeout(function () {
            if (localStorageService.get('user')) {
                $state.go('app.messages');
            } else {
                $state.go('login');
            }
        }, 1500);
    }
})();
