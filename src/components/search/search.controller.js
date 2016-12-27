(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['searchService', '$scope', '$rootScope'];
    function SearchCtrl(searchService, $scope, $rootScope) {
        var vm = this;
        vm.page = 1;
        vm.showInfinite = true;
        vm.list = [];
        vm.load = load;
        function load() {
            var data = {page: vm.page};
            if ($rootScope.loc) {
                data = Object.assign(data, $rootScope.loc);
            }
            searchService.getAll(data).then(function (res) {
                angular.forEach(res, function (item) {
                    vm.list.push(item);
                });
                if (res.length === 0) {
                    vm.page--;
                    vm.showInfinite = false;
                } else {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    vm.page++;
                }
            });
        }
    }
})();
