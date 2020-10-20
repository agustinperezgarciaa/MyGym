(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', '$state', '$window', 'articleResolve', 'Authentication', 'Notification', 'AdminService'];

  function ArticlesController($scope, $state, $window, article, Authentication, Notification, AdminService) {
    var vm = this;

    vm.article = article;
    vm.authentication = Authentication;
    vm.remove = remove;
    vm.userSuscriber = [];
    var i = 0;
    // Remove existing Article
    function remove() {
      if ($window.confirm('¿Está seguro que desea eliminar la Disciplina?')) {
        vm.article.$remove(function () {
          $state.go('admin.articles.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Disciplina eliminada correctamente!' });
        });
      }
    }

    AdminService.query(function (data) {
      vm.users = data;
      var vec = '';
      var length = 0;
      for (i = 0; i < vm.users.length; i++) {
        if (vm.users[i] && vm.users[i].discipline && vm.users[i].discipline._id === vm.article._id && vm.users[i].status === 'Activo') {
          vec += vm.users[i].displayName + '\n';
          length ++;
        }
      }
      vm.userSuscriber = vec;
      vm.length = length;
    });
  }
}());
