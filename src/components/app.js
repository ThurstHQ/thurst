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

    appRun.$inject = [];
    function appRun() {


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
