(function () {
    'use strict';
    angular
        .module('app.messages')
        .controller('MessagesCtrl', MessagesCtrl);

    MessagesCtrl.$inject = ['$rootScope'];
    function MessagesCtrl($rootScope) {
        var vm = this;
        vm.message = message;


        function message(id) {
            $applozic.fn.applozic('loadTab', id);
        }

        $rootScope.$watch('messages', function () {
            console.log($rootScope.messages);
            vm.list = $rootScope.messages;
        });
    }
})();
