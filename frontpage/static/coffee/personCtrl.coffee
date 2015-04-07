class PersonCtrl
  starData: null
  next: null
  starCount: 0
  starredProblems: []
  deactivate_path: DEACTIVATE_PATH
  logout_path: LOGOUT_PATH
  change_pass_path: CHANGE_PASS_PATH

  parseNext: (next)->
    if next
      match = next.match /page=(\d+)/
      if match.length == 2
        @next = parseInt(match[1])
        return
    @next = null
  
  load_more: ->
    @$models.Problem.starred page: @next, (data) =>
      for problem in data.results
        @parseNext data.next
        @starredProblems.push problem

  constructor: (@$models) ->
    @$models.Problem.starred (data) =>
      @parseNext data.next
      @starCount = data.count
      @starredProblems = data.results
      @starData = data

module.exports = PersonCtrl
