/**
 * Master Controller
 */

angular.module('RDash')
  .controller('SidebarCtrl', function ($scope, $window) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function () {
      return $window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function (newValue, oldValue) {
      if (newValue >= mobileView) {
        if (angular.isDefined($window.localStorage.toggle)) {
          $scope.toggle = $window.localStorage.toggle;
        } else {
          $scope.toggle = true;
        }
      } else {
        $scope.toggle = false;
      }
    });

    $scope.toggleSidebar = function () {
      $scope.toggle = !$scope.toggle;
      $window.localStorage.toggle = $scope.toggle;
    };

    $window.onresize = function () {
      $scope.$apply();
    };

    $scope.$watch('toggle', function(newValue){
      $scope.$emit('toggleSideBar', newValue);
    });
  });

