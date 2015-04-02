template_path = (path) ->
  path ?= ''
  return TEMPLATE_PATH_BASE + '/' + path

api_path = (path) ->
  return API_PATH_BASE + path

module.exports =
  api_path: api_path
  template_path: template_path
