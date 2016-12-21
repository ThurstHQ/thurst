(function () {
    'use strict';
    angular
        .module('app.verification')
        .controller('VerificationCtrl', VerificationCtrl);

    VerificationCtrl.$inject = ['loginService'];
    function VerificationCtrl(loginService) {
        var vm = this;

        vm.verification = verification;

        function verification(code) {
            loginService.verification(code).then(function () {
                $state.go('messages');
            });
        }
    }
})();
