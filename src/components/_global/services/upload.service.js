(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('uploadService', uploadService);

    uploadService.$inject = [
        'Restangular',
        'notificationsService',
        'localStorageService'
    ];

    function uploadService(Restangular, notificationsService, localStorageService) {
        return {
            upload: Restangular.service('api/upload'),
            setPhoto: function (data) {
                var user = localStorageService.get('user');
                return this.upload.post(data).then(function (res) {
                    user.avatar = res.avatar;
                    localStorageService.set('user', user);
                    notificationsService.hide();
                    return res;
                }, function (error) {
                    notificationsService.hide();
                    notificationsService.warn(error.msg);
                    return error;
                });
            }
        };
    }
})();
