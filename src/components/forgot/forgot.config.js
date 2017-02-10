(function () {
    'use strict';
    angular
        .module('app.forgot',[])
        .config(forgotConfig);

    forgotConfig.$inject = [
        '$stateProvider'
    ];
    function forgotConfig($stateProvider) {
        $stateProvider
            .state('forgot', {
                url: '/forgot',
                cache: false,
                templateUrl: 'components/forgot/forgot.template.html',
                controller: 'ForgotCtrl as vm'
            });
    }
})();
