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
            setPhotoPOST: function (data) {
                var profile = localStorageService.get('profile');
                notificationsService.loading();
                return this.upload.post(data).then(function (res) {
                    profile.avatar = res.path+'?'+Math.random();
                    localStorageService.set('profile', profile);
                    notificationsService.hide();
                    return profile;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            }
        };
    }
})();
