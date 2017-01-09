(function () {
    'use strict';
    angular
        .module('app.connections')
        .controller('ConnectionsCtrl', ConnectionsCtrl);

    ConnectionsCtrl.$inject = ['localStorageService', 'connectionsService', '$state'];
    function ConnectionsCtrl(localStorageService, connectionsService, $state) {
        var vm = this;
        vm.connections = localStorageService.get('connections');
        vm.goTo = goTo;
        vm.message = message;
        vm.remove = remove;
        function goTo(user) {
            localStorageService.set('user', user);
            $state.go('app.user');
        }

        function message(id) {
            $applozic.fn.applozic('loadTab', id);
        }

        function remove(id) {
            connectionsService.connectionsDELETE({connectionId: id}).then(function (res) {
                vm.connections = res;
            });
        }
    }
})();
