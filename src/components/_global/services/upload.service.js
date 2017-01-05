(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('uploadService', uploadService);

    uploadService.$inject = [
        'Restangular',
        'notificationsService',
        'localStorageService',
        'Settings'
    ];

    function uploadService(Restangular, notificationsService, localStorageService, Settings) {
        return {
            upload: Restangular.service('api/upload'),
            setPhotoPOST: function (data) {
                var user = localStorageService.get('user');
                notificationsService.loading();
                return this.upload.post(data).then(function (res) {
                    user.avatar = Settings.url + res.path;
                    localStorageService.set('user', user);
                    notificationsService.hide();
                    return user;
                }, function (error) {
                    notificationsService.hide();
                    notificationsService.warn(error.msg);
                    return error;
                });
            }
        };
    }
})();
