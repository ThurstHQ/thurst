(function () {
    'use strict';
    angular
        .module('app.user')
        .controller('UserCtrl', UserCtrl);

    UserCtrl.$inject = ['localStorageService', 'connectionsService', '$rootScope', 'user', 'analyticService'];
    function UserCtrl(localStorageService, connectionsService, $rootScope, user, analyticService) {
        var vm = this;
        vm.user = user;
        vm.profile = localStorageService.get('profile');

        vm.add = add;
        vm.remove = remove;
        vm.message = message;

        function add(user) {
            connectionsService.connectionsPOST(user).then(function () {
                analyticService.trackEvent('user', 'add to contacts', vm.user._id);
                vm.user.connectedBy.push(vm.profile._id);
                $rootScope.$emit('updateUserInSearch', vm.user);
            });
        }

        function remove() {
            connectionsService.connectionsDELETE(vm.user._id).then(function () {
                analyticService.trackEvent('user', 'remove from contacts', vm.user._id);
                vm.user.connectedBy.splice(vm.profile._id, 1);
                $rootScope.$emit('updateUserInSearch', vm.user);
            });
        }

        function message() {
            analyticService.trackEvent('messages', 'loadTab', vm.user._id);
            window.$applozic.fn.applozic('loadTab', vm.user._id);
        }
    }
})();