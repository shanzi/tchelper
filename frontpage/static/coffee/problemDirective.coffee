template_path = require('./utils.coffee').template_path

module.exports = ->
  restrict: 'E'
  scope:
    type: '='
    problem: '='
    action: '&'
  templateUrl: template_path('/problem.html')
