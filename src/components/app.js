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
        .run(appRun);

    appRun.$inject = [
        '$rootScope',
        '$ionicPopover',
        '$timeout'
    ];
    function appRun($rootScope, $ionicPopover, $timeout) {
        $rootScope.chatGlued = true;
        $rootScope.chatSubmit = chatSubmit;

        $ionicPopover.fromTemplateUrl('chat-popover.html', {
            scope: $rootScope
        }).then(function (popover) {
            $rootScope.chatPopover = popover;
        });
        $rootScope.chatPopoverOpen = function ($event) {
            $rootScope.chatPopover.show($event);
        };

        function chatSubmit() {
            $timeout(function () {
                $rootScope.chatGlued = true;
            });
        }

        $applozic.fn.applozic('subscribeToEvents', {
            onMessageReceived: function (data) {
                console.log('onMessageReceived', data);
            },
            onUserConnect: function (data) {
                console.log('onUserConnect', data);
            }
        });
    }
})();
