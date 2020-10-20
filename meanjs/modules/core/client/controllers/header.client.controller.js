(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService', 'AdminService'];

  function HeaderController($scope, $state, Authentication, menuService, AdminService) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.userBirthday = [];
    vm.expired = [];
    var i = 0;
    vm.oncharge = false;

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
      if (vm.authentication.user !== null && !vm.oncharge) {
        AdminService.query(function (data) {
          vm.users = data;
          for (i = 0; i < vm.users.length; i++) {
            if (vm.users[i] && isBirthday(vm.users[i].birDate) && (vm.users[i].status === 'Activo' || vm.users[i].status === 'newActivo')) {
              vm.userBirthday.push(vm.users[i].displayName);
            }
            isTodayExpired(vm.users[i]);
            if (vm.users[i] && isTodayExpired(vm.users[i]) && (vm.users[i].status === 'Activo' || vm.users[i].status === 'newActivo')) {
              vm.expired.push(vm.users[i].displayName);
            }
          }
          vm.cantNotif = vm.userBirthday.length + vm.expired.length;
        });
        vm.oncharge = true;
      }
    }

    function isBirthday(birthDate) {
      var today = new Date();
      var birth = new Date(birthDate);

      var todayMonth = today.getMonth() + 1;
      var todayDay = today.getDate();

      var birthMonth = birth.getMonth() + 1;
      var birthDay = birth.getDate();

      return ((todayMonth === birthMonth) && (todayDay === birthDay));
    }

    function isTodayExpired(a) {
      var today = new Date();
      var expire = new Date(a.expiration);

      var todayMonth = today.getMonth() + 1;
      var todayDay = today.getDate();

      var expireMonth = expire.getMonth() + 1;
      var expireDay = expire.getDate();

      return ((todayMonth === expireMonth) && (todayDay === expireDay));

    }
  }
}());
