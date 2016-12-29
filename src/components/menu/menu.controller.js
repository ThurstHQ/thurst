(function () {
    'use strict';
    angular
        .module('app.menu')
        .controller('MenuCtrl', MenuCtrl);

    MenuCtrl.$inject = ['$scope', '$state'];
    function MenuCtrl($scope, $state) {
        var vm = this;

        $scope.$on('$stateChangeSuccess', function () {
            vm.now = $state.current.name;
        });
    }
})();
