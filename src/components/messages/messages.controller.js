(function () {
    'use strict';
    angular
        .module('app.messages')
        .controller('MessagesCtrl', MessagesCtrl);

    MessagesCtrl.$inject = ['$rootScope', '$scope', '$timeout', 'analyticService'];
    function MessagesCtrl($rootScope, $scope, $timeout, analyticService) {
        var vm = this;
        vm.message = message;
        vm.load = load;

        window.$applozic.fn.applozic('subscribeToEvents', {
            onMessageReceived: function () {
                load();
            },
            onUserConnect: function () {
                load();
            }
        });

        function load() {
            window.$applozic.fn.applozic('getMessages', {
                callback: function getUserDetail(response) {
                    if (response.status === 'success') {
                        angular.forEach(response.data.userDetails, function (val, key) {
                            angular.forEach(response.data.message, function (mval) {
                                if (val.userId === mval.contactIds) {
                                    response.data.userDetails[key].lastMessage = mval;
                                }
                            });
                        });
                        $scope.$evalAsync(function () {
                            vm.list = response.data;
                            vm.loaded = response.data.userDetails.length < 100;
                        });
                    }
                    $rootScope.$broadcast('scroll.refreshComplete');
                }
            });
        }

        function message(id) {
            analyticService.trackEvent('messages', 'loadTab', id);
            window.$applozic.fn.applozic('loadTab', id);
            $timeout(function () {
                load();
            }, 3000);
        }
    }
})();
