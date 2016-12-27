(function () {
    'use strict';
    angular
        .module('app.terms')
        .controller('TermsCtrl', TermsCtrl);

    TermsCtrl.$inject = ['data'];
    function TermsCtrl(data) {
        var vm = this;
        vm.data = data;
    }
})();
