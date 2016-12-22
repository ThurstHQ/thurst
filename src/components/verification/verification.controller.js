(function () {
    'use strict';
    angular
        .module('app.verification')
        .controller('VerificationCtrl', VerificationCtrl);

    VerificationCtrl.$inject = ['$state', 'loginService', '$stateParams'];
    function VerificationCtrl($state, loginService, $stateParams) {
        var vm = this;

        vm.verification = verification;

        function verification(code) {
            loginService.verification({
                id: $stateParams.id,
                code: code
            }).then(function () {
                $state.go('app.profile');
            });
        }
    }
})();
