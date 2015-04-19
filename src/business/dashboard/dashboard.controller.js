/**
 * Created by quentine on 15-4-17.
 */
'use strict';
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider) {
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'business/dashboard/dashboard.html'
      });
  }
]);