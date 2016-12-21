(function () {
    'use strict';
    angular
        .module('app.verification')
        .controller('VerificationCtrl', VerificationCtrl);

    VerificationCtrl.$inject = [];
    function VerificationCtrl() {
        var vm = this;

        vm.verification = verification;

        function verification(user) {
            console.log(user);
        }
    }
})();
