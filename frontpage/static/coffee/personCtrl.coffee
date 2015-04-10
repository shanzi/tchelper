class PersonCtrl
  starData: null
  next: null
  starCount: 0
  starredProblems: []
  deactivate_path: DEACTIVATE_PATH
  logout_path: LOGOUT_PATH
  change_pass_path: CHANGE_PASS_PATH

  profileData: null
  difficulty: 2

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

  save_difficulty: ->
      @profileData.difficulty = @difficulty
      @profileData.$update()

  readable_difficulty: ->
      switch parseInt(@difficulty)
          when 0
              'Very Easy'
          when 1
              'Easy'
          when 2
              'Medium'
          when 3
              'Hard'
          when 4
              'Very Hard'

  constructor: (@$models) ->
    @$models.Problem.starred (data) =>
      @parseNext data.next
      @starCount = data.count
      @starredProblems = data.results
      @starData = data

    @$models.Profile.me (data) =>
      @difficulty = data.difficulty
      @profileData = data

module.exports = PersonCtrl
