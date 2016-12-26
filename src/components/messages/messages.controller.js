(function () {
    'use strict';
    angular
        .module('app.messages')
        .controller('MessagesCtrl', MessagesCtrl);

    MessagesCtrl.$inject = [];
    function MessagesCtrl() {
        var vm = this;

        // console.log(messages);
        $applozic.fn.applozic('getUserDetail', {
            callback: function getUserDetail(response) {
                if (response.status === 'success') {
                    console.log(response.data);
                    vm.chats = response.data.users;
                }
            }
        });
    }
})();
