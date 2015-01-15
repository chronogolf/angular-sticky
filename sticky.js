angular.module("sticky", []).directive("sticky", ['$window', '$timeout', function($window, $timeout) {
  return {
    link: function(scope, element, attrs) {

      var $win = angular.element($window);

      if (scope._stickyElements === undefined) {
        scope._stickyElements = [];

        $win.bind("scroll.sticky", function(e) {
          var pos = $win.scrollTop();
          for (var i=0; i<scope._stickyElements.length; i++) {

            var item = scope._stickyElements[i];

            if (!item.isStuck && pos > item.start) {
              item.element.css({ width: item.element.outerWidth(false) + "px" });
              item.element.addClass("stuck");
              item.isStuck = true;

              if (item.placeholder) {
                item.placeholder = angular.element("<div></div>")
                    .css({height: item.element.outerHeight(false) + "px"})
                    .insertBefore(item.element);
              }
            }
            else if (item.isStuck && pos < item.start) {
              item.element.removeClass("stuck");
              item.element.css({ width: "auto" });
              item.isStuck = false;

              if (item.placeholder) {
                item.placeholder.remove();
                item.placeholder = true;
              }
            }
          }
        });

        var recheckPositions = function() {
          for (var i=0; i<scope._stickyElements.length; i++) {
            var item = scope._stickyElements[i];
            if (!item.isStuck) {
              item.start = item.element.offset().top;
            } else if (item.placeholder) {
              item.start = item.placeholder.offset().top;
            }
          }
        };
        $win.bind("load", recheckPositions);
        $win.bind("resize", recheckPositions);
      }

      $timeout(function(){
        var item = {
          element: element,
          isStuck: false,
          placeholder: attrs.usePlaceholder !== undefined,
          start: element.offset().top
        };
        scope._stickyElements.push(item);
      });

    }
  };
}]);
