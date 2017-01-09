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

    function locationService(Restangular, notificationsService) {
        return {
            location: Restangular.service('api/location'),
            updateLocationPOST: function (data) {
                return this.location.post(data).then(function (res) {
                    notificationsService.hide();
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            }
        };
    }
})();
