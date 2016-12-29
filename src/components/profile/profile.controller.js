(function () {
    'use strict';
    angular
        .module('app.profile')
        .controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = ['userService', 'cameraService', '$ionicActionSheet', 'localStorageService', 'uploadService', '$rootScope'];
    function ProfileCtrl(userService, cameraService, $ionicActionSheet, localStorageService, uploadService, $rootScope) {
        var vm = this;

        vm.user = localStorageService.get('user');


        vm.pictureUpdate = pictureUpdate;
        vm.userUpdate = userUpdate;
        vm.initGeo = initGeo;

        function initGeo(data) {
            if (data) {
                $rootScope.$emit('initGeo');
            }
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
                        uploadService.setPhotoPOST({avatar: "data:image/jpeg;base64," + imageData}).then(function (res) {
                            vm.user.avatar = res.avatar;
                        });
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