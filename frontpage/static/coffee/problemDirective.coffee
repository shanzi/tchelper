template_path = require('./utils.coffee').template_path

initSwipeAction = (scope, element, $swipe) ->
  scope.done_action = scope.action
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
      if not scope.problem.done
        element.removeClass('not-touching')
        originX = obj.x
    move: (obj) ->
      if not scope.problem.done
        getOffset(obj.x)
        updateOffset(obj.x)
    end: (obj) ->
      if not scope.problem.done
        scope.action() if swipeOffset > 80
      element.addClass('not-touching')
      swipeOffset = 0
      updateOffset()
    cancel: (obj) ->
      element.addClass('not-touching')
      swipeOffset = 0
      updateOffset()

module.exports = ($location, $swipe) ->
  restrict: 'E'
  scope:
    type: '='
    problem: '='
    action: '&'
  templateUrl: template_path('/problem_directive.html')

  link: (scope, element) ->
    scope.detail_action= ->
      $location.path('/problem/' + scope.problem.originProblem)

    if scope.type == 'star'
      scope.is_star = true
    else
      scope.is_assignment = true

    console.log scope

    if scope.action and (not scope.problem.done) and scope.is_assignment
      initSwipeAction(scope, element, $swipe)
