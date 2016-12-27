(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['searchService'];
    function SearchCtrl(searchService) {
        var vm = this;

        searchService.getAll().then(function (res) {
            vm.list = res;
        });
    }
})();
