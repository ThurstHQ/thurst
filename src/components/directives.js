(function () {
    'use strict';
    angular
        .module('app')
        .directive('compareTo', compareTo)
        .directive('errSrc', errSrc);

    compareTo.$inject = [];
    function compareTo() {
        return {
            require: 'ngModel',
            scope: {
                otherModelValue: '=compareTo'
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue === scope.otherModelValue;
                };

                scope.$watch('otherModelValue', function () {
                    ngModel.$validate();
                });
            }
        };
    }

    function errSrc() {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return attrs.ngSrc;
                }, function (value) {
                    if (!value) {
                        element.attr('src', attrs.errSrc);
                    }
                });

                element.bind('error', function () {
                    element.attr('src', attrs.errSrc);
                });
            }
        };
    }
})();