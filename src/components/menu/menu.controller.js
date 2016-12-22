(function () {
    'use strict';
    angular
        .module('app.menu')
        .controller('MenuCtrl', MenuCtrl);

    MenuCtrl.$inject = ['$scope', 'user', '$state'];
    function MenuCtrl($scope, user, $state) {
        var vm = this;

        // window.applozic.init({
        //     appId: Settings.applozic_key,
        //     userId: user.id,
        //     userName: user.name,
        //     imageLink: '',
        //     email: user.email,
        //     contactNumber: '',
        //     desktopNotification: true,
        //     source: window.cordova ? '6' : '1',
        //     notificationIconLink: 'https://www.applozic.com/favicon.ico',
        //     authenticationTypeId: '1',
        //     accessToken: '',
        //     locShare: true,
        //     googleApiKey: "AIzaSyDKfWHzu9X7Z2hByeW4RRFJrD9SizOzZt4",
        //     googleMapScriptLoaded: false,
        //     autoTypeSearchEnabled: true,
        //     loadOwnContacts: false,
        //     olStatus: false,
        //     onInit: function (response) {
        //         if (response === "success") {
        //             // login successful, perform your actions if any, for example: load contacts, getting unread message count, etc
        //         } else {
        //             // error in user login/register (you can hide chat button or refresh page)
        //         }
        //     },
        //     contactDisplayName: function (otherUserId) {
        //         return otherUserId;
        //     },
        //     contactDisplayImage: function (otherUserId) {
        //         return otherUserId;
        //     },
        //     onTabClicked: function (response) {
        //         // write your logic to execute task on tab load
        //         //   object response =  {
        //         //    tabId : userId or groupId,
        //         //    isGroup : 'tab is group or not'
        //         //  }
        //     }
        // });

        $scope.$on('$stateChangeSuccess', function () {
            vm.now = $state.current.name;
        });
    }
})();
