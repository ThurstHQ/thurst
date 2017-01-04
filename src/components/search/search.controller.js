(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['searchService', '$scope', '$ionicModal'];
    function SearchCtrl(searchService, $scope, $ionicModal) {
        var vm = this,
            perPage = 10,
            page = 1;

        vm.showInfinite = true;
        vm.list = [];
        vm.load = load;
        vm.add = add;
        vm.message = message;
        vm.search = search;
        function load(filter) {
            var data = {
                page: page,
                amount: perPage
            };
            data = Object.assign(data, vm.filter);

            searchService.allGET(data).then(function (res) {
                if (filter) {
                    vm.list = res;
                } else {
                    angular.forEach(res, function (item) {
                        vm.list.push(item);
                    });
                }
                if (res.length < perPage) {
                    page--;
                    vm.showInfinite = false;
                } else {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    page++;
                }
            });
        }

        function add() {
        }

        function message(id) {
            $applozic.fn.applozic('loadTab', id);
        }

        function search(filter) {
            if (filter) {
                page = 1;
                load(filter);
            }
            vm.modal.hide();
        }

        $ionicModal.fromTemplateUrl('components/_global/templates/filter.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.modal = modal;
        });
    }
})();
