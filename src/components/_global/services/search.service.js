(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('searchService', searchService);

    searchService.$inject = ['notificationsService', 'Restangular', 'localStorageService'];

    function searchService(notificationsService, Restangular, localStorageService) {
        return {
            search: Restangular.service('api/search'),
            getAll: function () {
                notificationsService.loading();
                var data = {};
                if (localStorageService.get('user').loc) {
                    navigator.geolocation.getCurrentPosition(function (pos) {
                        data.latitude = pos.coords.latitude;
                        data.longitude = pos.coords.longitude;
                    });
                }
                return this.search.one().get(data).then(function (res) {
                    notificationsService.hide();
                    return res;
                }, function (error) {
                    notificationsService.hide();
                    return error;
                });
            }
        };
    }
})();