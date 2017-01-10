(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('locationService', locationService);

    locationService.$inject = [
        'Restangular',
        'notificationsService',
        'localStorageService'
    ];

    function locationService(Restangular, notificationsService, localStorageService) {
        return {
            location: Restangular.service('api/location'),
            updateLocationPOST: function (data, profile) {
                return this.location.post(data).then(function (res) {
                    profile.coords = res.coords;
                    localStorageService.set('profile', profile);
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            }
        };
    }
})();
