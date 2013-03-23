angular.module('widget.directives', [])
  .directive('statusLine', function () {
    return function (scope, element, attrs) {
      $(element).attr('data-line-id', scope.line.id);
      $(element).attr('data-ok', scope.line.status === 'good service');
      if (scope.line.status === 'good service') {
        $(element).find('.status').removeClass('colour');
      }
      else {
        $(element).find('.status').addClass('colour');
      }
    };
  });