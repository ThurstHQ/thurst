(function () {
    'use strict';
    angular
        .module('app.support')
        .controller('SupportCtrl', SupportCtrl);

    SupportCtrl.$inject = ['analyticService'];
    function SupportCtrl(analyticService) {
        var vm = this;

        vm.showFAQs = showFAQs;
        vm.showConversation = showConversation;

        function showFAQs() {
            analyticService.trackEvent('support', 'showFAQs');
            window.HelpshiftPlugin.showFAQs();
        }

        function showConversation() {
            analyticService.trackEvent('support', 'showConversation');
            window.HelpshiftPlugin.showConversation();
        }
    }
})();
