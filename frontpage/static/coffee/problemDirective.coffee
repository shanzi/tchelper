template_path = require('./utils.coffee').template_path

module.exports = ($location, $swipe) ->
  restrict: 'E'
  scope:
    type: '='
    problem: '='
    action: '&'
  templateUrl: template_path('/problem.html')
  link: (scope, element) ->
    scope.detail_action= ->
      $location.path('/problem/' + scope.problemId)

    swipeElement = element.children()
    originX = 0
    swipeOffset = 0
    cancelingOffset = false

    getOffset = (x) ->
      offset = x - originX
      offset = 0 if offset > 0
      swipeOffset = 100 - 100 * Math.pow(1.2, offset/10)

    updateOffset = ->
      swipeElement.attr 'style', "-webkit-transform: translate(-#{swipeOffset}px, 0);transform: translate(-#{swipeOffset}px, 0)"

    $swipe.bind element,
      start: (obj) ->
        originX = obj.x
      move: (obj) ->
        getOffset(obj.x)
        updateOffset(obj.x)
      end: (obj) ->
        getOffset(obj.x)
        scope.action() if swipeOffset > 80
        swipeOffset = 0
        updateOffset(obj.x)
      cancel: (obj) ->
        swipeOffset = 0
        updateOffset(obj.x)
