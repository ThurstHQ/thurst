(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('changePasswordService', changePasswordService);

    changePasswordService.$inject = [
        'Restangular',
        'notificationsService',
        'localStorageService'
    ];

    function changePasswordService(Restangular, notificationsService) {
        return {
            chngpwd: Restangular.service('api/chngpwd'),
            changePasswordPOST: function (data) {
                return this.chngpwd.post(data).then(function (res) {
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
