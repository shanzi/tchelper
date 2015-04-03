utils = require './utils.coffee'

api_path = utils.api_path

module.exports = ($resource) ->
  'Problem':
    $resource api_path('/problems/:id/'), {id: '@id'},
      starred:
        url: api_path('/problems/starred/')

  'Assignment':
    $resource api_path('/assignments/:id'), {id: '@id'},
      solved:
        url: api_path('/assignments/solved')
      done:
        url: api_path('/assignments/:id/done/')
        params: {id: '@id'}
        method: 'POST'

  'Sheet':
    $resource api_path('/sheets/:number'), {number: '@number'}
