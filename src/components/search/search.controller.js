(function () {
    'use strict';
    angular
        .module('app.search')
        .controller('SearchCtrl', SearchCtrl);

    SearchCtrl.$inject = ['searchService'];
    function SearchCtrl(searchService) {
        var vm = this;

        vm.getList = getList;
        function getList() {
            searchService.getAll();
        }
    }
})();
