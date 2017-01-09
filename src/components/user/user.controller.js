(function () {
    'use strict';
    angular
        .module('app.user')
        .controller('UserCtrl', UserCtrl);

    UserCtrl.$inject = ['localStorageService', 'connectionsService', '$rootScope'];
    function UserCtrl(localStorageService, connectionsService, $rootScope) {
        var vm = this;
        vm.user = localStorageService.get('user');
        vm.profile = localStorageService.get('profile');

        vm.add = add;
        vm.remove = remove;

        function add(user) {
            connectionsService.connectionsPOST(user).then(function () {
                vm.user.connectedBy.push(vm.profile._id);
                $rootScope.$emit('updateUserInSearch', vm.user);
            });
        }

        function remove() {
            connectionsService.connectionsDELETE({connectionId: vm.user._id}).then(function () {
                vm.user.connectedBy.splice(vm.profile._id, 1);
                $rootScope.$emit('updateUserInSearch', vm.user);
            });
        }
    }
})();