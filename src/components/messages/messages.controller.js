(function () {
    'use strict';
    angular
        .module('app.messages')
        .controller('MessagesCtrl', MessagesCtrl);

    MessagesCtrl.$inject = ['$rootScope'];
    function MessagesCtrl($rootScope) {
        var vm = this;
        vm.message = message;
        vm.load = load;

        function load() {
            $applozic.fn.applozic('getMessages', {
                callback: function getUserDetail(response) {
                    if (response.status === 'success') {
                        angular.forEach(response.data.userDetails, function (val, key) {
                            response.data.userDetails[key].lastMessage = response.data.message[key];
                        });
                        vm.list = response.data;
                        vm.loaded = response.data.userDetails.length < 100;
                    }
                    $rootScope.$broadcast('scroll.refreshComplete');
                }
            });
        }

        function message(id) {
            $applozic.fn.applozic('loadTab', id);
        }
    }
})();
