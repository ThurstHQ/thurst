(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['searchService', '$scope', '$rootScope', '$ionicModal', 'connectionsService', 'localStorageService', '$ionicListDelegate', 'Settings'];
    function SearchCtrl(searchService, $scope, $rootScope, $ionicModal, connectionsService, localStorageService, $ionicListDelegate, Settings) {
        var vm = this,
            perPage = 10,
            page = 1;

        vm.moreDataCanBeLoaded = true;
        vm.list = {};
        vm.filter = {};
        vm.profile = localStorageService.get('profile');

        vm.load = load;
        vm.add = add;
        vm.remove = remove;
        vm.message = message;
        vm.search = search;
        vm.doRefresh = doRefresh;

        function load() {
            var data = Object.assign({
                page: page,
                amount: perPage
            }, vm.filter);
            searchService.allGET(data).then(function (res) {
                angular.forEach(res, function (val) {
                    if (val.avatar) {
                        val.avatar = Settings.url + val.avatar;
                    }
                    vm.list[val._id] = val;
                });
                if (res.length < perPage) {
                    vm.moreDataCanBeLoaded = false;
                } else {
                    page++;
                    vm.moreDataCanBeLoaded = true;
                }
                $rootScope.$broadcast('scroll.infiniteScrollComplete');
                $rootScope.$broadcast('scroll.refreshComplete');
            });
        }

        function add(user) {
            connectionsService.connectionsPOST(user).then(function () {
                $ionicListDelegate.closeOptionButtons();
                vm.list[user._id].connectedBy.push(vm.profile._id);
            });
        }

        function remove(id) {
            connectionsService.connectionsDELETE(id).then(function () {
                $ionicListDelegate.closeOptionButtons();
                vm.list[id].connectedBy.splice(vm.profile._id, 1);
            });
        }

        function message(id) {
            $applozic.fn.applozic('loadTab', id);
        }

        function search() {
            page = 1;
            vm.list = {};
            vm.modal.hide();
            angular.forEach(vm.filter, function (val, key) {
                if (!val) {
                    delete vm.filter[key];
                }
            });
            load();
        }

        function doRefresh() {
            page = 1;
            load();
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
