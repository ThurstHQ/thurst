(function () {
    'use strict';
    angular
        .module('app.profile')
        .controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = ['loginService', 'userService', 'cameraService', '$ionicActionSheet', 'localStorageService'];
    function ProfileCtrl(loginService, userService, cameraService, $ionicActionSheet, localStorageService) {
        var vm = this;

        vm.user = localStorageService.get('user') || {};

        vm.logout = logout;
        vm.pictureUpdate = pictureUpdate;
        vm.userUpdate = userUpdate;

        function logout() {
            loginService.logout();
        }

        function pictureUpdate() {
            var options = {
                quality: 50,
                destinationType: 0,
                allowEdit: true,
                saveToPhotoAlbum: false,
                correctOrientation: true
            };
            $ionicActionSheet.show({
                buttons: [
                    {text: 'Gallery'},
                    {text: 'Camera'}
                ],
                titleText: 'Image Source',
                cancelText: 'Cancel',
                buttonClicked: function (index) {
                    if (index === 0) {
                        options.sourceType = 0;
                    } else {
                        options.sourceType = 1;
                    }
                    cameraService.getPicture(options).then(function (imageData) {
                        userService.setPhoto({user_avatar: "data:image/jpeg;base64," + imageData});
                    });
                }
            });
        }

        function userUpdate(data) {
            userService.userPUT(data).then(function (res) {
                vm.user = res;
            });
        }
    }
})();
