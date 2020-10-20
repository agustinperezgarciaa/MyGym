(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'UsersService', 'PasswordValidator'];

  function UserController($scope, $state, $window, Authentication, user, Notification, UsersService, PasswordValidator) {
    var vm = this;

    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.user = user;
    vm.user.birDate = new Date(vm.user.birDate);
    vm.remove = remove;
    vm.update = update;
    vm.isContextUserSelf = isContextUserSelf;
    vm.changeUserPassword = changeUserPassword;
    vm.changeUserPasswordNew = changeUserPasswordNew;
    vm.getClients = getClients;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    vm.disciplines = getDisciplines();

    var previusStatus = vm.user.status;

    function getDisciplines() {
      UsersService.getArticles()
        .then(function (response) {
          vm.disciplines = response;
        }, function (error) {
        });
    }

    $scope.CheckVissibleInputs = function () {
      if (($scope.vm.user.roles[0] === 'admin') || ($scope.vm.user.roles[0] === 'user')) {
        $scope.vissibleAdmin = true;
        $scope.vissibleClient = false;
        $scope.vm.user.disciplines = ' ';
        $scope.vm.user.username = '';
      } else {
        $scope.vissibleAdmin = false;
        $scope.vissibleClient = true;
        $scope.vm.user.username = vm.user.dni;
        $scope.vm.user.password = '';
        // $scope.vm.credentials.username = $scope.vm.credentials.dni;
        // $scope.vm.credentials.password = 'Mario123..';
      }
    };

    $scope.CheckVissibleDescription = function () {
      if (vm.user.status === 'Inactivo') {
        $scope.vissibleDescription = true;
      } else {
        $scope.vissibleDescription = false;
      }
    };

    $scope.cancel = function () {
      $state.go('admin.user', {
        userId: user._id
      });
    };

    function remove(user) {
      if ($window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('Usuario eliminado correctamente!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Usuario eliminado correctamente!' });
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
        return false;
      }
      vm.user = setActiveInactiveUser(vm.user);
      var user = vm.user;
      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Usuario modificado correctamente!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error al crear usuario!' });
      });
    }

    function setActiveInactiveUser(user) {
      if (user.status === 'Inactivo' && previusStatus === 'Activo') {
        vm.user.inactiveDate = new Date();
        vm.user.userWhoInactivated = vm.authentication.user.displayName;
        vm.user.status = 'Inactivo';
      } else
        if (user.status === 'Activo' && previusStatus === 'Inactivo') {
          vm.user.status = 'newActivo';
          vm.user.activityDate = new Date();
          vm.user.statusDescription = '';
        }
      return vm.user;
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
    init();

    function init() {
      if (vm.authentication.user.roles[0] === 'admin') {
        $scope.showRoles = true;
      }
      if (vm.user.roles[0] === 'client') {
        $scope.vissibleClient = true;
      } else {
        $scope.vissibleAdmin = true;
        $scope.vissiblePass = false;
      }
      if (vm.user.roles[0] === 'admin') {
        vm.user.roles.show = 'Administrador';
      } else {
        if (vm.user.roles[0] === 'client') {
          vm.user.roles.show = 'Cliente';
        } else {
          if (vm.user.roles[0] === 'user') {
            vm.user.roles.show = 'Empleado';
          }
        }
      }
    }

    // Change user password
    function changeUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.passwordForm');

        return false;
      }

      UsersService.changePassword(vm.passwordDetails)
        .then(onChangePasswordSuccess)
        .catch(onChangePasswordError);
    }

    function onChangePasswordSuccess(response) {
      // If successful show success message and clear form
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Contraseña cambiada correctamente' });
      vm.passwordDetails = null;
    }

    function onChangePasswordError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error al cambiar la contraseña!' });
    }
    // Change user password
    function changeUserPasswordNew(isValid) {

      // if (!isValid) {
      //   $scope.$broadcast('show-errors-check-validity', 'vm.passwordFormNew');

      //   return false;
      // }
      vm.passwordDetailsNew.id = vm.user._id;
      UsersService.changePasswordNew(vm.passwordDetailsNew)
        .then(onChangePasswordSuccessNew)
        .catch(onChangePasswordErrorNew);
    }

    function getClients() {
      UsersService.getClients();
    }

    function onChangePasswordSuccessNew(response) {
      // If successful show success message and clear form
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Contraseña cambiada correctamente' });
      vm.passwordDetailsNew = null;
    }

    function onChangePasswordErrorNew(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error al cambiar la contraseña!' });
    }
  }

}());
