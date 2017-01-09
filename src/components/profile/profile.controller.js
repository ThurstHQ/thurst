(function () {
    'use strict';
    angular
        .module('app.profile')
        .controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = ['profileService', 'cameraService', '$ionicActionSheet', 'localStorageService', 'uploadService', '$rootScope'];
    function ProfileCtrl(profileService, cameraService, $ionicActionSheet, localStorageService, uploadService, $rootScope) {
        var vm = this;

        vm.profile = localStorageService.get('profile');


        vm.pictureUpdate = pictureUpdate;
        vm.profileUpdate = profileUpdate;
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
            var hideSheet = $ionicActionSheet.show({
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
                        hideSheet();
                        uploadService.setPhotoPOST({avatar: "data:image/jpeg;base64," + imageData}).then(function (res) {
                            vm.profile = res;
                        });
                    });
                }
            });
        }

        function profileUpdate(data) {
            profileService.profilePUT(data).then(function (res) {
                vm.profile = res;
            });
        }
    }
})();