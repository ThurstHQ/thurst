(function () {
    'use strict';
    angular
        .module('app.menu')
        .controller('MenuCtrl', MenuCtrl);

    MenuCtrl.$inject = ['$scope', '$state', 'userService'];
    function MenuCtrl($scope, $state, userService) {
        var vm = this;


        navigator.geolocation.getCurrentPosition(function (pos) {
            userService.userPUT({
                type: 'Point',
                coordinates: [pos.coords.longitude, pos.coords.latitude]
            });
        });

        $scope.$on('$stateChangeSuccess', function () {
            vm.now = $state.current.name;
        });
    }
})();
