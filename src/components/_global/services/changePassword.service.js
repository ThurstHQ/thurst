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
                    notificationsService.show('Saved');
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            }
        };
    }
})();
