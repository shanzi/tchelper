utils = require './utils.coffee'

api_path = utils.api_path

module.exports = ($resource) ->
  'Problem':
    $resource api_path('/problems/:id/'), {id: '@id'},
      starred:
        url: api_path('/problems/starred/')
      has_star:
        url: api_path('/problems/:id/has_star')
        params: {id: '@problemId'}
      star:
        url: api_path('/problems/:id/star/')
        params: {id: '@id'}
        method: 'POST'
      unstar:
        url: api_path('/problems/:id/unstar/')
        params: {id: '@id'}
        method: 'POST'

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

  'Comment':
    $resource api_path('/comments/'), {}

