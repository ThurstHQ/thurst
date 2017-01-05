(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('connectionsService', connectionsService);

    connectionsService.$inject = ['Restangular', 'localStorageService', 'notificationsService'];

    function connectionsService(Restangular, localStorageService, notificationsService) {
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
                    notificationsService.warn(error.msg);
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
                    notificationsService.hide();
                    notificationsService.warn(error.msg);
                    return error;
                });
            },
            connectionsDELETE: function (data) {
                var me = this;
                notificationsService.loading();
                return this.connections.one().customDELETE(null, data).then(function (res) {
                    delete me.data[data.connectionId];
                    localStorageService.set('connections', me.data);
                    notificationsService.hide();
                    return me.data;
                }, function (error) {
                    notificationsService.hide();
                    return error;
                });
            }
        };
    }
})();
