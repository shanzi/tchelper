class AppCtrl
  go: (path) ->
    @$location.path(path)

  constructor: (@$location) ->
    @title = 'TCHelper | app'

module.exports = AppCtrl
