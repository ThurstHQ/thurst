(function () {
    'use strict';
    angular
        .module('app.about')
        .controller('AboutCtrl', AboutCtrl);

    AboutCtrl.$inject = ['data'];
    function AboutCtrl(data) {
        var vm = this;
        vm.data = data;
    }
})();
