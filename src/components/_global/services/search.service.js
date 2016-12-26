(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('searchService', searchService);

    searchService.$inject = ['notificationsService', 'Restangular'];

    function searchService(notificationsService, Restangular) {
        return {
            search: Restangular.service('api/search'),
            getAll: function (data) {
                notificationsService.loading();
                return this.search.getList(data).then(function (res) {
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