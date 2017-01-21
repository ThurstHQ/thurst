(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('profileService', profileService);

    profileService.$inject = ['Restangular', 'localStorageService', 'notificationsService', 'loginService', 'locationService'];

    function profileService(Restangular, localStorageService, notificationsService, loginService, locationService) {
        return {
            profile: Restangular.service('api/profile'),
            initGeo: function (profile) {
                navigator.geolocation.getCurrentPosition(function (pos) {
                    locationService.updateLocationPOST({
                        longitude: pos.coords.longitude,
                        latitude: pos.coords.latitude
                    }, profile);
                });
            },
            profileGET: function () {
                var me = this;
                return this.profile.one().get().then(function (res) {
                    if (res.loc) {
                        me.initGeo(res);
                    }
                    localStorageService.set('profile', res);
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            },
            profilePUT: function (data) {
                var me = this;
                notificationsService.loading();
                return this.profile.one().customPUT(data).then(function (res) {
                    if (res.loc) {
                        me.initGeo(res);
                    }
                    localStorageService.set('profile', res);
                    notificationsService.show('Saved');
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            },
            profileDELETE: function () {
                notificationsService.loading();
                this.profile.one().customDELETE().then(function (res) {
                    notificationsService.hide();
                    loginService.logout();
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            }
        };
    }
})();
