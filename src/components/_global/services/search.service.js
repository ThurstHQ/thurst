(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('searchService', searchService);

    searchService.$inject = ['notificationsService', 'Restangular'];

    function searchService(notificationsService, Restangular) {
        return {
            search: Restangular.service('api/search'),
            allGET: function (data) {
                return this.search.one().get(data).then(function (res) {
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return false;
                });
            }
        };
    }
})();