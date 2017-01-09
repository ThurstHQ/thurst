(function () {
    'use strict';
    angular
        .module('app.messages')
        .controller('MessagesCtrl', MessagesCtrl);

    MessagesCtrl.$inject = ['$rootScope'];
    function MessagesCtrl($rootScope) {
        var vm = this;
        vm.message = message;
        vm.doRefresh = doRefresh;

        function message(id) {
            $applozic.fn.applozic('loadTab', id);
        }

        function doRefresh() {
            $rootScope.$emit('getUserDetail');
            $rootScope.$broadcast('scroll.refreshComplete');
        }

        $rootScope.$watch('messages', function () {
            vm.list = $rootScope.messages;
        });
    }
})();
