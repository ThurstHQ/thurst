(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('connectionsService', connectionsService);

    connectionsService.$inject = ['Restangular', 'localStorageService', 'notificationsService', 'Settings'];

    function connectionsService(Restangular, localStorageService, notificationsService, Settings) {
        return {
            connections: Restangular.service('api/connections'),
            data: localStorageService.get('connections') || {},
            connectionsGET: function () {
                var me = this;
                return me.connections.one().get().then(function (res) {
                    angular.forEach(me.data, function (val) {
                        delete me.data[val._id];
                    });
                    angular.forEach(res.iamconnected, function (val) {
                        me.data[val._id] = val;
                    });
                    localStorageService.set('connections', me.data);
                    return me.data;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            },
            connectionsPOST: function (data) {
                var me = this;
                notificationsService.loading();
                return this.connections.post({connectionId: data._id}).then(function (res) {
                    if (res.success) {
                        me.data[data._id] = data;
                        localStorageService.set('connections', me.data);
                    }
                    notificationsService.hide();
                    return res;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            },
            connectionsDELETE: function (data) {
                var me = this;
                notificationsService.loading();
                return this.connections.one().customDELETE(null, {connectionId: data}).then(function () {
                    delete me.data[data];
                    localStorageService.set('connections', me.data);
                    notificationsService.hide();
                    return me.data;
                }, function (error) {
                    notificationsService.warn(error.data.message);
                    return error;
                });
            }
        };
    }
})();
