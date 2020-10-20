(function () {
  'use strict';

  angular
    .module('cobros')
    .controller('CobrosListController', CobrosListController);

  CobrosListController.$inject = ['CobrosService', '$filter', 'Authentication'];

  function CobrosListController(CobrosService, $filter, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.joingFilters = joingFilters;
    vm.totalFilter = totalFilter;
    vm.resultFilterForTotalAmoun = [];
    vm.findUsersToDisplay = findUsersToDisplay;
    vm.cobros = [];
    vm.displayName = [];
    vm.totalAmount = 0;
    var i = 0;
    var tempDisplayName = [];
    init();

    function init() {
      CobrosService.getList(1).then((res)=>{
        vm.cobros = res;
        for (i = 0; i < vm.cobros.length; i++) {
          try {
            tempDisplayName.push(vm.cobros[i].user.displayName);
          } catch (e) {
            tempDisplayName.push('Cliente eliminado');
          }
        }
        vm.displayName = tempDisplayName;
        vm.search = new Date(2000, 0, 1);
        vm.searchTo = new Date();
        vm.searchUsers = '';
        vm.buildPager();
      });
    }

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.joingFilters();
      vm.totalFilter();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = vm.cobros.filter((item)=>{
        var created = new Date(item.created);
        created.setHours(0, 0, 0, 0);
        var search = new Date(vm.search);
        search.setHours(0, 0, 0, 0);
        var searchTo = new Date(vm.searchTo);
        searchTo.setHours(0, 0, 0, 0);
        return ((created.getTime() >= search.getTime()) && (created.getTime() <= searchTo.getTime()));
      });
      return vm.filteredItems;
    }

    function findUsersToDisplay() {
      vm.filteredItems = vm.cobros.filter((item)=>{
        var users = '';
        try {
          users = item.user.displayName;
        } catch (e) {
          users = 'Cliente eliminado';
        }
        return users.toLowerCase().includes(vm.searchUsers.toLowerCase());
      });
      return vm.filteredItems;
    }

    function joingFilters() {
      var dateFilter = [];
      var userFilter = [];
      dateFilter = vm.figureOutItemsToDisplay();
      userFilter = vm.findUsersToDisplay();

      var resultFilter = dateFilter.filter(function (n) {
        return userFilter.indexOf(n) !== -1;
      });
      vm.filterLength = resultFilter.length;
      vm.resultFilterForTotalAmoun = resultFilter;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = resultFilter.slice(begin, end);
      vm.totalFilter();
    }

    function pageChanged() {
      vm.joingFilters();
    }

    function totalFilter() {
      vm.totalAmount = 0;
      for (i = 0; i < vm.resultFilterForTotalAmoun.length; i++) {
        vm.totalAmount = vm.totalAmount + vm.resultFilterForTotalAmoun[i].amount;
      }
    }

  }
}());
