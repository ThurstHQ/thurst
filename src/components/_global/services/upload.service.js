(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('uploadService', uploadService);

    uploadService.$inject = [
        'Restangular',
        'notificationsService'
    ];

    function uploadService(Restangular, notificationsService) {
        return {
            upload: Restangular.service('api/upload'),
            setPhoto: function (data) {
                var user = localStorageService.get('user');
                return this.user.post(null, data).then(function (res) {
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
