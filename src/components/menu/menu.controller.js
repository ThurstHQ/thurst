(function () {
    'use strict';
    angular
        .module('app.menu')
        .controller('MenuCtrl', MenuCtrl);

    MenuCtrl.$inject = ['$scope', '$state', 'loginService'];
    function MenuCtrl($scope, $state, loginService) {
        var vm = this;

        vm.logout = logout;

        function logout() {
            loginService.logout();
        }

        $scope.$on('$stateChangeSuccess', function () {
            vm.now = $state.current.name;
        });

        // window.$applozic.fn.applozic('subscribeToEvents', {
        //     onMessageReceived: function (data) {
        //         console.log('onMessageReceived', data);
        //     },
        //     onUserConnect: function (data) {
        //         console.log('onUserConnect', data);
        //     }
        // });
    }
})();
