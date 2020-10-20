(function () {
  'use strict';

  // Cobros controller
  angular
    .module('cobros')
    .controller('CobrosController', CobrosController);

  CobrosController.$inject = ['$scope', '$state', '$window', 'Authentication', '$filter', 'AdminService'];

  function CobrosController($scope, $state, $window, Authentication, $filter, AdminService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.changeCobro = changeCobro;
    vm.vencido = true;
    vm.isExpired = false;
    var i = 0;

    AdminService.query(function (data) {
      vm.users = data;
      vm.users = resetExpirationForNewActives(vm.users);
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function changeCobro(userId) {
      $state.go('newcobro', { userId: userId });
    }

    function figureOutItemsToDisplay() {
      // vm.filteredItems = $filter('filter')(vm.users, {
      //   $: vm.search
      // });
      vm.filteredItems = vm.users.filter((a) => {
        const type = a.roles.indexOf('client') !== 0;
        let validate;
        if (vm.search) {
          validate = a.displayName.toLowerCase().includes(vm.search.toLowerCase());
        } else {
          validate = true;
        }
        let expirate;
        if (vm.vencido) {
          if (!a.expiration) {
            expirate = true;
          } else {
            expirate = new Date(a.expiration) <= new Date();
          }
        } else {
          expirate = true;
        }
        let activo;
        if (a.status === 'Activo' || a.status === 'newActivo') {
          activo = true;
        } else {
          if (a.status === 'Inactivo') {
            activo = false;
          }
        }
        isExpired(a);
        return validate && expirate && !type && activo;
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    function isExpired(a) {
      a.isExpired = new Date(a.expiration) <= new Date();
    }

    function resetExpirationForNewActives(users) {
      for (i = 0; i < users.length; i++) {
        if (users[i].status === 'newActivo') {
          users[i].expiration = null;
        }
      }
      return users;
    }

  }
}());
