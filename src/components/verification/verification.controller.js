(function () {
    'use strict';
    angular
        .module('app.verification')
        .controller('VerificationCtrl', VerificationCtrl);

    VerificationCtrl.$inject = ['loginService', '$stateParams'];
    function VerificationCtrl(loginService, $stateParams) {
        var vm = this;

        vm.verification = verification;

        function verification(code) {
            loginService.verification({
                id: $stateParams.password,
                code: code
            }).then(function () {
                $state.go('messages');
            });
        }
    }
})();
