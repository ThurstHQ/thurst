(function () {
    'use strict';
    angular
        .module('app.verification', [])
        .config(verificationConfig);

    verificationConfig.$inject = [
        '$stateProvider'
    ];
    function verificationConfig($stateProvider) {
        $stateProvider
            .state('verification', {
                url: '/verification',
                cache: false,
                templateUrl: 'components/verification/verification.html',
                controller: 'VerificationCtrl as vm'
            });
    }
})();
