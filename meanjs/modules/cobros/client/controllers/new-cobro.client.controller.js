(function () {
  'use strict';

  angular
    .module('cobros')
    .controller('NewCobroController', NewCobroController);

  NewCobroController.$inject = ['$stateParams', 'CobrosService', '$state'];

  function NewCobroController($stateParams, CobrosService, $state) {
    var vm = this;
    vm.createCobro = createCobro;
    vm.searchPrice = searchPrice;
    init();

    function init() {
      CobrosService.getData($stateParams.userId).then((res) => {
        vm.cobro = res.user;
        vm.disciplines = res.disciplines;
        if (res.user.discipline) {
          vm.discipline = res.user.discipline;
        }
      });
    }

    function searchPrice(id) {
      const a = vm.disciplines;
      if (!id) {
        return { price: 0 };
      }
      const res = a.filter((did) => {
        if (did._id === id) {
          return true;
        }
        return false;
      });
      return res[0];
    }
    function createCobro() {
      CobrosService.create(vm.cobro, searchPrice(vm.discipline._id)).then((res) => {
        $state.go('cobroscreate');
      });
    }
  }
}());
