(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['searchService', '$scope', '$ionicModal', 'connectionsService', 'localStorageService', '$ionicListDelegate'];
    function SearchCtrl(searchService, $scope, $ionicModal, connectionsService, localStorageService, $ionicListDelegate) {
        var vm = this,
            perPage = 10,
            page = 1;

        vm.showInfinite = true;
        vm.list = {};
        vm.user = localStorageService.get('user');

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
                    vm.list = {};
                }
                angular.forEach(res, function (val) {
                    vm.list[val._id] = val;
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

        function add(user) {
            connectionsService.connectionsPOST(user).then(function () {
                vm.list[user._id].connectedBy.push(vm.user._id);
                $ionicListDelegate.closeOptionButtons();
            });
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
