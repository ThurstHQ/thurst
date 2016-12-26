(function () {
    'use strict';
    angular
        .module('app.messages', [])
        .config(messagesConfig);

    messagesConfig.$inject = [
        '$stateProvider'
    ];
    function messagesConfig($stateProvider) {
        $stateProvider
            .state('app.messages', {
                cache: false,
                url: 'messages',
                views: {
                    'menuContent': {
                        templateUrl: 'components/messages/messages.html',
                        controller: 'MessagesCtrl as vm'
                    }
                },
                resolve: {
                    // messages: function () {
                    // return $applozic.fn.applozic('getUserDetail', {
                    //     callback: function getUserDetail(data) {
                    //         return data;
                    //     }
                    // });
                    // }
                }
            });
    }
})();
