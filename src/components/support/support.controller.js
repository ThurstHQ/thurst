(function () {
    'use strict';
    angular
        .module('app.support')
        .controller('SupportCtrl', SupportCtrl);

    SupportCtrl.$inject = [];
    function SupportCtrl() {
        var vm = this;

        vm.showFAQs = showFAQs;
        vm.showConversation = showConversation;

        function showFAQs() {
            window.HelpshiftPlugin.showFAQs();
        }

        function showConversation() {
            window.HelpshiftPlugin.showConversation();
        }
    }
})();
