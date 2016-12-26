(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['list'];
    function SearchCtrl(list) {
        var vm = this;

        console.log(list);
    }
})();
