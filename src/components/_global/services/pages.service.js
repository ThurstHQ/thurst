(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('pagesService', pagesService);

    pagesService.$inject = ['notificationsService', 'Restangular'];

    function pagesService(notificationsService, Restangular) {
        return {
            pages: Restangular.service('wp/v2/pages'),
            policyGET: function () {
                notificationsService.loading();
                return this.pages.one('34654').get().then(function (data) {
                    notificationsService.hide();
                    return data;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return false;
                });
            },
            termsGET: function () {
                notificationsService.loading();
                return this.pages.one('34652').get().then(function (data) {
                    notificationsService.hide();
                    return data;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return false;
                });
            },
            aboutGET: function () {
                notificationsService.loading();
                return this.pages.one('34656').get().then(function (data) {
                    notificationsService.hide();
                    return data;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return false;
                });
            }
        };
    }
})();
