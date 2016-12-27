(function () {
    'use strict';
    angular
        .module('app.policy')
        .controller('PolicyCtrl', PolicyCtrl);

    PolicyCtrl.$inject = ['data'];
    function PolicyCtrl(data) {
        var vm = this;
        vm.data = data;
    }
})();
