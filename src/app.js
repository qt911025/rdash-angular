'use strict';
angular.module('RDash', ['ui.bootstrap', 'ui.router'])
  .config(function ($urlRouterProvider) {
    // For unmatched routes
    $urlRouterProvider.otherwise('/');
  })
  .run(function($rootScope){
    $rootScope.sdb = true;
    $rootScope.$on('toggleSideBar', function(e, state){
      $rootScope.sdb = state;
    });
  });