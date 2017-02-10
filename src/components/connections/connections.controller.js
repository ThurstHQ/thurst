(function () {
    'use strict';
    angular
        .module('app.connections')
        .controller('ConnectionsCtrl', ConnectionsCtrl);

    ConnectionsCtrl.$inject = ['localStorageService', 'connectionsService', 'analyticService'];
    function ConnectionsCtrl(localStorageService, connectionsService, analyticService) {
        var vm = this;
        vm.connections = localStorageService.get('connections');
        vm.remove = remove;

        function remove(id) {
            connectionsService.connectionsDELETE(id).then(function (res) {
                analyticService.trackEvent('connections', 'user', 'delete');
                vm.connections = res;
            });
        }
    }
})();
