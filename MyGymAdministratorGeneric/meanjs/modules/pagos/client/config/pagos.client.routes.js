(function () {
  'use strict';

  angular
    .module('pagos')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('pagos', {
        abstract: true,
        url: '/pagos',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('pagoslist', {
        url: '/pagoslist',
        templateUrl: '/modules/pagos/client/views/list-pagos.client.view.html',
        controller: 'PagosListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Pagos List',
          roles: ['user', 'admin']
        }
      })
      .state('pagoscreate', {
        url: '/createpago',
        templateUrl: '/modules/pagos/client/views/form-pago.client.view.html',
        controller: 'PagosController',
        controllerAs: 'vm',
        resolve: {
          pagoResolve: newPago
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Pagos Create'
        }
      })
      .state('pagosedit', {
        url: '/:pagoId/pagosedit',
        templateUrl: '/modules/pagos/client/views/form-pago.client.view.html',
        controller: 'PagosController',
        controllerAs: 'vm',
        resolve: {
          pagoResolve: getPago
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Pago {{ pagoResolve.name }}'
        }
      })
      .state('pagosview', {
        url: '/:pagoId',
        templateUrl: '/modules/pagos/client/views/view-pago.client.view.html',
        controller: 'PagosController',
        controllerAs: 'vm',
        resolve: {
          pagoResolve: getPago
        },
        data: {
          pageTitle: 'Pago {{ pagoResolve.name }}',
          roles: ['user', 'admin']
        }
      });
  }

  getPago.$inject = ['$stateParams', 'PagosService'];

  function getPago($stateParams, PagosService) {
    return PagosService.get({
      pagoId: $stateParams.pagoId
    }).$promise;
  }

  newPago.$inject = ['PagosService'];

  function newPago(PagosService) {
    return new PagosService();
  }
}());
