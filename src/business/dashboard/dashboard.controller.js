/**
 * Created by quentine on 15-4-17.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider) {
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'business/dashboard/dashboard.html',
        controller: 'DashboardCtrl'
      });
  }
])
  .controller('DashboardCtrl', function($scope){
    $scope.message = 'Hello RDash!';
  });