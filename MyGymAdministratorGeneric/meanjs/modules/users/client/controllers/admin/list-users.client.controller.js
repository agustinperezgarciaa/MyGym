(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$filter', 'AdminService', 'Authentication'];

  function UserListController($scope, $filter, AdminService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.setRolShow = setRolShow;
    var i = 0;
    var temp = [];

    AdminService.query(function (data) {
      vm.users = data;
      if (vm.authentication.user.roles[0] === 'admin') {
        vm.buildPager();
      } else {
        for (i = 0; i < vm.users.length; i++) {
          if (vm.users[i].roles[0] === 'client') {
            temp.push(vm.users[i]);
          }
        }
        vm.users.length = 0;
        vm.users = temp;
        vm.buildPager();
      }
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = vm.users.filter((a) => {
        let search;
        if (vm.search) {
          search = a.displayName.toLowerCase().includes(vm.search.toLowerCase());
        } else {
          search = true;
        }
        let inactivo;
        if (vm.inactivo) {
          inactivo = true;
        } else {
          inactivo = a.status !== 'Inactivo';
        }
        return inactivo && search;
      });

      vm.filteredItems = setRolShow(vm.filteredItems);
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    function setRolShow(users) {
      for (i = 0; i < users.length; i++) {
        if (users[i].roles[0] === 'admin') {
          users[i].rolesShow = 'Administrador';
        } else {
          if (users[i].roles[0] === 'client') {
            users[i].rolesShow = 'Cliente';
          } else {
            if (users[i].roles[0] === 'user') {
              users[i].rolesShow = 'Empleado';
            }
          }
        }
      }
      return users;
    }

  }
}());
