(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', '$filter', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification', 'AdminService', '$stateParams'];

  function HomeController($scope, $state, $filter, UsersService, $location, $window, Authentication, PasswordValidator, Notification, AdminService, $stateParams) {
    var vm = this;
    vm.viewDetails = viewDetails;
    vm.buildPager = buildPager;
    vm.userClient = '';
    vm.searchUser = searchUser;
    vm.inputDNI = '';
    vm.isExpired = false;
    vm.diffDate = diffDate;

    UsersService.getClients().then((resultClients) => {
      vm.users = resultClients;
      if ($stateParams.userDni) {
        vm.inputDNI = $stateParams.userDni;
        console.log($stateParams.userDni);
        searchUser();
      }
    });

    function buildPager() {
      searchUser();
    }

    function searchUser() {
      vm.inputDNI = $stateParams.userDni ? $stateParams.userDni : vm.userForm.dni.$viewValue;
      vm.filteredItems = search(vm.inputDNI);
      vm.filterLength = vm.filteredItems.length;
      if (vm.filterLength === 0 || !vm.inputDNI) {
        onUserSignupError();
      } else {
        viewDetails(vm.filteredItems[0]);
      }
    }

    function search(inputDNI) {
      vm.filteredItems = vm.users.filter((item)=>{
        return (item.dni === inputDNI) && (item.roles[0] === 'client');
      });
      return vm.filteredItems;
    }

    function viewDetails(resultUser) {
      var dni = resultUser.dni;
        // Authentication.user = resultUser;
      vm.user = resultUser;
      isExpired(resultUser);
      diffDate(resultUser);
      $state.go('clientDetails', { userDni: dni });
    }

    function onUserSignupError() {
      Notification.error({ message: 'Usuario no encontrado', title: '<i class="glyphicon glyphicon-remove"></i> El DNI ingresado no se encuentra registrado en el sistema', delay: 6000 });
    }
    function isExpired(a) {
      if (!a.expiration) {
        a.isExpired = true;
      } else {
        a.isExpired = new Date(a.expiration) <= new Date();
      }
    }

    function diffDate(a) {
      var nextExpirationDate = new Date(a.expiration);
      var currentDat = new Date();
      var diff = 0;
      if (nextExpirationDate <= currentDat) {
        diff = parseInt(currentDat - nextExpirationDate, 0);
      } else {
        diff = parseInt(nextExpirationDate - currentDat, 0);
      }

      var expirationDate = Math.round(diff / (1000 * 60 * 60 * 24));
      a.expirationDate = expirationDate;
    }
  }
}());
