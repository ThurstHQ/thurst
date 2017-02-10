(function () {
    'use strict';
    angular
        .module('app.forgot')
        .controller('ForgotCtrl', ForgotCtrl);

    ForgotCtrl.$inject = ['loginService'];
    function ForgotCtrl(loginService) {
        var vm = this;
        vm.code = false;
        vm.codeVerify = false;

        vm.forgot = forgot;
        vm.sendEmailForForgot = sendEmailForForgot;
        vm.sendCodeForForgot = sendCodeForForgot;

        function forgot(password, email) {
            loginService.forgotPOST({password: password, email: email});
        }

        function sendEmailForForgot(email) {
            loginService.forgotEmailPOST({email: email}).then(function (res) {
                vm.code = res;
            });
        }

        function sendCodeForForgot(code) {
            loginService.forgotCodePOST({code: code}).then(function (res) {
                vm.codeVerify = res;
            });
        }
    }
})();
