(function () {
    'use strict';
    angular
        .module('app.connections')
        .controller('ConnectionsCtrl', ConnectionsCtrl);

    ConnectionsCtrl.$inject = ['localStorageService', 'connectionsService'];
    function ConnectionsCtrl(localStorageService, connectionsService) {
        var vm = this;
        vm.connections = localStorageService.get('connections');
        vm.remove = remove;

        function remove(id) {
            connectionsService.connectionsDELETE(id).then(function (res) {
                vm.connections = res;
            });
        }
    }
})();
