(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['searchService', '$state', '$scope', '$rootScope', '$ionicModal', 'connectionsService', 'localStorageService', '$ionicListDelegate', 'Settings'];
    function SearchCtrl(searchService, $state, $scope, $rootScope, $ionicModal, connectionsService, localStorageService, $ionicListDelegate, Settings) {
        var vm = this,
            perPage = 10,
            page = 1;

        vm.showInfinite = true;
        vm.list = {};
        vm.profile = localStorageService.get('profile');

        vm.load = load;
        vm.add = add;
        vm.remove = remove;
        vm.message = message;
        vm.search = search;
        vm.goTo = goTo;

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
                    if (val.avatar) {
                        val.avatar = Settings.url + val.avatar;
                    }
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
                $ionicListDelegate.closeOptionButtons();
                vm.list[user._id].connectedBy.push(vm.profile._id);
            });
        }

        function remove(user) {
            connectionsService.connectionsDELETE({connectionId: user._id}).then(function () {
                $ionicListDelegate.closeOptionButtons();
                vm.list[user._id].connectedBy.splice(vm.profile._id, 1);
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

        function goTo(user) {
            localStorageService.set('user', user);
            $state.go('app.user');
        }


        $ionicModal.fromTemplateUrl('components/_global/templates/filter.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.modal = modal;
        });
        $rootScope.$on('updateUserInSearch', function (event, user) {
            vm.list[user._id] = user;
        });
    }
})();
