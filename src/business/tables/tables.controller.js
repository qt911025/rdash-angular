/**
 * Created by quentine on 15-4-17.
 */
angular.module('RDash').config(function ($stateProvider) {
  $stateProvider
    .state('tables', {
      url: '/tables',
      templateUrl: 'business/tables/tables.html'
    });
});