(function () {
    'use strict';
    angular
        .module('app.menu')
        .controller('MenuCtrl', MenuCtrl);

    MenuCtrl.$inject = ['$scope', 'Settings', 'user', '$state', 'localStorageService'];
    function MenuCtrl($scope, Settings, user, $state, localStorageService) {
        var vm = this;

        window.applozic.init({
            appId: Settings.applozic_key,
            userId: user._id,
            userName: user.name,
            imageLink: user.avatar,
            email: user.email,
            contactNumber: '',
            desktopNotification: true,
            source: window.cordova ? '6' : '1',
            notificationIconLink: 'https://www.applozic.com/favicon.ico',
            authenticationTypeId: '1',
            accessToken: localStorageService.get('token'),
            locShare: true,
            googleApiKey: "AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4",
            googleMapScriptLoaded: false,
            autoTypeSearchEnabled: true,
            loadOwnContacts: false,
            olStatus: false
        });

        $scope.$on('$stateChangeSuccess', function () {
            vm.now = $state.current.name;
        });
    }
})();
