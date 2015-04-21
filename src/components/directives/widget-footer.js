/**
 * Widget Footer Directive
 */

angular
  .module('RDash')
  .directive('rdWidgetFooter', rdWidgetFooter);

function rdWidgetFooter() {
  return {
    replace: true,
    requires: '^rdWidget',
    transclude: true,
    template: '<div class="widget-footer" ng-transclude></div>',
    restrict: 'E'
  };
}