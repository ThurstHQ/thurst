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
                notificationsService.loading();
                return this.search.one().get(data).then(function (res) {
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