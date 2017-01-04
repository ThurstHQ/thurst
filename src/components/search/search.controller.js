(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['searchService', '$scope', 'localStorageService', '$ionicModal'];
    function SearchCtrl(searchService, $scope, localStorageService, $ionicModal) {
        var vm = this,
            user = localStorageService.get('user'),
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
            if (user.loc) {
                data = Object.assign(data, user.coordinates);
            }
            if (filter) {
                data = Object.assign(data, filter);
            }

            searchService.allGET(data).then(function (res) {
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

        function add() {
        }

        function message(id) {
            $applozic.fn.applozic('loadTab', id);
        }

        function search(filter) {
            page = 1;
            if (filter) {
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
