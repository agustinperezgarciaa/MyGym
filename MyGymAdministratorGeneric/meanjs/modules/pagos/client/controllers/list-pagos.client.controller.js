(function () {
  'use strict';

  angular
    .module('pagos')
    .controller('PagosListController', PagosListController);

  PagosListController.$inject = ['PagosService', '$scope', '$filter', 'Authentication'];

  function PagosListController(PagosService, $scope, $filter, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.totalFilter = totalFilter;
    vm.currentUser = vm.authentication.user.displayName;
    vm.resultFilterForTotalAmoun = [];
    vm.pageChanged = pageChanged;
    vm.totalAmount = 0;
    vm.currentUserRol = vm.authentication.user.roles;
    var i = 0;

    PagosService.query(function (data) {
      vm.pagos = data;
      vm.search = new Date(2000, 0, 1);
      vm.searchTo = new Date();
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
      vm.totalFilter();
    }

    function figureOutItemsToDisplay() {
      // vm.filteredItems = $filter('filter')(vm.pagos, {
      //   $: vm.search
      // });
      vm.filteredItems = vm.pagos.filter((item)=>{
        var created = new Date(item.created);
        created.setHours(0, 0, 0, 0);
        var search = new Date(vm.search);
        search.setHours(0, 0, 0, 0);
        var searchTo = new Date(vm.searchTo);
        searchTo.setHours(0, 0, 0, 0);
        var elementDisplayName = item.user.displayName;
        var correctUser = vm.currentUser === elementDisplayName;
        if (vm.currentUserRol === 'admin') {
          correctUser = true;
        }
        return ((created.getTime() >= search.getTime()) && (created.getTime() <= searchTo.getTime()) && (correctUser));
      });
      vm.filterLength = vm.filteredItems.length;
      vm.resultFilterForTotalAmoun = vm.filteredItems;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
      vm.totalFilter();
    }

    function totalFilter() {
      vm.totalAmount = 0;
      for (i = 0; i < vm.resultFilterForTotalAmoun.length; i++) {
        vm.totalAmount = vm.totalAmount + parseInt(vm.resultFilterForTotalAmoun[i].price, 10);
      }
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

  }
}());
