/**
 * Widget Body Directive
 */

angular
  .module('RDash')
  .directive('rdWidgetBody', rdWidgetBody);

function rdWidgetBody() {
  return {
    replace: true,
    requires: '^rdWidget',
    scope: {
      loading: '@?',
      classes: '@?'
    },
    transclude: true,
    template: '<div class="widget-body" ng-class="classes"><rd-loading ng-show="loading"></rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',
    restrict: 'E'
  };
}