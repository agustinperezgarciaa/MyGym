// Pagos service used to communicate Pagos REST endpoints
(function () {
  'use strict';

  angular
    .module('pagos')
    .factory('PagosService', PagosService);

  PagosService.$inject = ['$resource'];

  function PagosService($resource) {
    return $resource('/api/pagos/:pagoId', {
      pagoId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
