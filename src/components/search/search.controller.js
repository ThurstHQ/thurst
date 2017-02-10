(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['searchService', '$scope', '$rootScope', '$ionicModal', 'connectionsService', 'localStorageService', '$ionicListDelegate', 'analyticService'];
    function SearchCtrl(searchService, $scope, $rootScope, $ionicModal, connectionsService, localStorageService, $ionicListDelegate, analyticService) {
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
        vm.search = search;
        vm.doRefresh = doRefresh;

        function load(doRefresh) {
            var data = $.extend({
                page: page,
                amount: perPage
            }, vm.filter);

            searchService.allGET(data).then(function (res) {
                if (res) {
                    var users = (res.users) ? res.users : res;
                    analyticService.trackEvent('search', 'search', 'found', users.length);
                    if (doRefresh) {
                        vm.list = {};
                    }
                    angular.forEach(users, function (val) {
                        vm.list[val._id] = val;
                    });
                    if (users.length < perPage) {
                        vm.moreDataCanBeLoaded = false;
                    } else {
                        page++;
                        vm.moreDataCanBeLoaded = true;
                    }
                    $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    $rootScope.$broadcast('scroll.refreshComplete');
                }
            });
        }

        function add(user) {
            connectionsService.connectionsPOST(user).then(function () {
                analyticService.trackEvent('search', 'request', 'add');
                $ionicListDelegate.closeOptionButtons();
                vm.list[user._id].connectedBy.push(vm.profile._id);
            });
        }

        function remove(id) {
            connectionsService.connectionsDELETE(id).then(function () {
                analyticService.trackEvent('search', 'request', 'delete');
                $ionicListDelegate.closeOptionButtons();
                vm.list[id].connectedBy.splice(vm.profile._id, 1);
            });
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
            load(true);
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
