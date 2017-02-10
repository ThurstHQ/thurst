(function () {
    'use strict';
    angular
        .module('app.profile')
        .controller('ProfileCtrl', ProfileCtrl);

    ProfileCtrl.$inject = ['profileService', 'cameraService', '$ionicActionSheet', 'localStorageService', 'uploadService', '$rootScope', 'Settings', 'analyticService'];
    function ProfileCtrl(profileService, cameraService, $ionicActionSheet, localStorageService, uploadService, $rootScope, Settings, analyticService) {
        var vm = this;

        vm.profile = localStorageService.get('profile');

        initBirthday(vm.profile.birthday);

        vm.pictureUpdate = pictureUpdate;
        vm.profileUpdate = profileUpdate;

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
                        uploadService.setPhotoPOST({avatar: 'data:image/png;base64,' + imageData}).then(function (res) {
                            analyticService.trackEvent('profile', 'avatar', 'updated');
                            vm.profile = res;
                        });
                    });
                }
            });
        }

        function initBirthday(birthday) {
            if (birthday) {
                vm.profile.birthday = new Date(birthday);
            }
        }

        function profileUpdate(data) {
            if (data.loc) {
                $rootScope.$emit('initGeo', data);
            } else {
                data.coords = [];
            }
            profileService.profilePUT(data).then(function (res) {
                analyticService.trackEvent('profile', 'info', 'updated');
                vm.profile = res;
                initBirthday(res.birthday);
                window.$applozic.fn.applozic('reInitialize', {
                    appId: Settings.applozic_key, //jshint ignore:line
                    userId: vm.profile._id,
                    userName: vm.profile.username,
                    imageLink: vm.profile.avatar,
                    email: vm.profile.email
                });
            });
        }
    }
})();