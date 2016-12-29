(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['searchService', '$scope', 'localStorageService'];
    function SearchCtrl(searchService, $scope, localStorageService) {
        var vm = this,
            user = localStorageService.get('user'),
            perPage = 10,
            page = 1;

        vm.showInfinite = true;
        vm.list = [];

        vm.load = load;
        function load() {
            var data = {
                page: page,
                amount: perPage
            };
            if (user.loc) {
                data = Object.assign(data, user.coordinates);
            }
            searchService.getAll(data).then(function (res) {
                angular.forEach(res, function (item) {
                    vm.list.push(item);
                });
                if (res.length < perPage) {
                    page--;
                    vm.showInfinite = false;
                } else {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    page++;
                }
            });
        }
    }
})();
