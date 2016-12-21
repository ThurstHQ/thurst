(function () {
    'use strict';
    angular
        .module('app.messages')
        .controller('MessagesCtrl', MessagesCtrl);

    MessagesCtrl.$inject = [];
    function MessagesCtrl() {
        var vm = this;
    }
})();
