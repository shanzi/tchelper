api_path = (path) ->
  return API_PATH_BASE + path

module.exports = ($resource) ->
  'Problem':
    $resource api_path('/problems/:id/'), {id: '@id'},
      starred:
        url: api_path('/problems/starred/')

  'Assignment':
    $resource api_path('/assignments/:id'), {id: '@id'},
      solved:
        url: api_path('/assignments/solved')

  'Sheet':
    $resource api_path('/sheets/:number'), {number: '@number'},
      latest:
        url: api_path('/sheets/latest')
