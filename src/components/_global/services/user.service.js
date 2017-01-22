(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('userService', userService);

    userService.$inject = ['Restangular', 'notificationsService', 'Settings'];

    function userService(Restangular, notificationsService, Settings) {
        return {
            user: Restangular.service('api/user'),
            userGET: function (data) {
                return this.user.get(data).then(function (res) {
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            }
        };
    }
})();
