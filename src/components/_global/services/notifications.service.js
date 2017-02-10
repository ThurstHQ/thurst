(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('notificationsService', notificationsService);

    notificationsService.$inject = [
        '$ionicPopup',
        '$ionicLoading'
    ];

    function notificationsService($ionicPopup, $ionicLoading) {
        return {
            loading: function (text) {
                $ionicLoading.show({
                    template: text || 'Loading...'
                });
            },
            show: function (title, text) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: title,
                    template: text,
                    okType: 'button-calm'
                });
            },
            warn: function (text) {
                this.hide();
                this.show('Timeout Error', text);
            },
            hide: function () {
                $ionicLoading.hide();
            }
        };
    }
})();
