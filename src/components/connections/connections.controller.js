(function () {
    'use strict';
    angular
        .module('app.connections')
        .controller('ConnectionsCtrl', ConnectionsCtrl);

    ConnectionsCtrl.$inject = ['localStorageService'];
    function ConnectionsCtrl(localStorageService) {
        var vm = this;
        vm.user = localStorageService.get('user');
    }
})();
