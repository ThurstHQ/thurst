(function () {
    'use strict';
    angular
        .module('app.config')
        .factory('analyticService', analyticService);

    analyticService.$inject = [];

    function analyticService() {
        return {
            setUserId: function (id) {
                if (window.cordova) {
                    window.ga.setUserId(id);
                }
            },
            trackEvent: function (category, action, label, value) {
                if (window.cordova) {
                    // window.ga.trackEvent('Category', 'Action', 'Label', Value)
                    window.ga.trackEvent(category, action, label, value);
                }
            },
            trackMetric: function () {

            }
        };
    }
})();
