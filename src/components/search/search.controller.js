(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['searchService', '$scope', 'localStorageService'];
    function SearchCtrl(searchService, $scope, localStorageService) {
        var vm = this;
        vm.reqData = {page: 1};
        vm.showInfinite = true;
        vm.load = load;

        if (localStorageService.get('user').loc) {
            navigator.geolocation.getCurrentPosition(function (pos) {
                vm.reqData.latitude = pos.coords.latitude;
                vm.reqData.longitude = pos.coords.longitude;
            });
        }

        function load() {
            searchService.getAll(vm.reqData).then(function (res) {
                vm.list = res;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if (res.length === 0) {
                    vm.reqData.page--;
                    vm.showInfinite = false;
                } else {
                    vm.reqData.page++;
                }
            });
        }

    }
})();
