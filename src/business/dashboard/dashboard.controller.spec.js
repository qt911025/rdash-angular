/**
 * Created by quentine on 15-4-18.
 */

'use strict';

describe('Controller: Dashboard', function(){

  var DashboardCtrl, scope;

  beforeEach(module('RDash'));
  beforeEach(module('business/dashboard/dashboard.html'));

  beforeEach(inject(function($controller, $rootScope){

    scope = $rootScope.$new();
    DashboardCtrl = $controller('DashboardCtrl', {
      $scope: scope
    });
  }));

  it('should do something', function(){
    expect(scope.message).toBe('Hello RDash!');
  })

});