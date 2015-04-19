angular.module('RDash', ['ui.bootstrap', 'ui.router'])
  .config(function ($urlRouterProvider) {
    // For unmatched routes
    $urlRouterProvider.otherwise('/');
  })
  .run(function($rootScope){
    $rootScope.$on('toggleSideBar', function(e, state){
      $rootScope.sdb = state;
    });
  });