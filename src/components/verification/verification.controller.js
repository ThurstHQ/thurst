(function () {
    'use strict';
    angular
        .module('app.verification')
        .controller('VerificationCtrl', VerificationCtrl);

    VerificationCtrl.$inject = ['$state', 'loginService', '$stateParams', 'notificationsService'];
    function VerificationCtrl($state, loginService, $stateParams, notificationsService) {
        var vm = this;
        vm.email = $stateParams.email;

        vm.verification = verification;

        function verification(code) {
            loginService.verificationPOST({
                id: $stateParams.id,
                code: code
            }).then(function (response) {
                notificationsService.hide();
                if (response) {
                    $state.go('app.profile');
                }
            });
        }
    }
})();
