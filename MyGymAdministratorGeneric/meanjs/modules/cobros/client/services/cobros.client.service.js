(function () {
  'use strict';

  // PasswordValidator service used for testing the password strength
  angular
    .module('cobros')
    .factory('CobrosService', CobrosService);

  CobrosService.$inject = ['$resource', '$http'];

  function CobrosService($resource, $http) {

    let cobro = $resource('/api/cobrodata', { userId: '@id' });
    let cobroList = $resource('/api/cobros', { userId: '@id' });

    var service = {
      getData: getData,
      create: create,
      getList: getList
    };

    return service;

    function getData(userId) {
      return cobro.get({ userId: userId }).$promise;
    }
    function getList(userId) {
      return cobroList.query({ userId: userId }).$promise;
    }
    function create(cobro, disipline) {
      let newCobro = $resource('/api/cobrodata');
      return newCobro.save({ cobro: cobro, disipline: disipline }).$promise;

    //   return $http({
    //     url: '/api/cobros',
    //     method: "POST",
    //     data: { 'cobro' : cobro, disipline: disipline }
    // })
    }

  }

}());
