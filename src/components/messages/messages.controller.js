(function () {
    'use strict';
    angular
        .module('app.messages')
        .controller('MessagesCtrl', MessagesCtrl);

    MessagesCtrl.$inject = [];
    function MessagesCtrl() {
        var vm = this;

        vm.openChat = openChat;
        function openChat(otherUserId) {
            $applozic.fn.applozic('loadTab', otherUserId);
        }

        $applozic.fn.applozic('getUserDetail', {
            callback: function getUserDetail(response) {
                if (response.status === 'success') {
                    vm.chats = response.data.users;
                }
            }
        });
    }
})();
