(function () {
    'use strict';
    angular
        .module('app.settings', [])
        .config(settingsConfig);

    settingsConfig.$inject = [
        '$stateProvider'
    ];
    function settingsConfig($stateProvider) {
        $stateProvider
            .state('app.settings', {
                cache: false,
                url: 'settings',
                views: {
                    'menuContent': {
                        templateUrl: 'components/settings/settings.html',
                        controller: 'SettingsCtrl as vm'
                    }
                }
            });
    }
})();
