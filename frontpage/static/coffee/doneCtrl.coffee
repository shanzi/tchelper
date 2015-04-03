class DoneCtrl
  doneData: null
  next: null
  count: 0
  problems: []

  parseNext: (next)->
    if next
      match = next.match /page=(\d+)/
      if match.length == 2
        @next = parseInt(match[1])
        return
    @next = null
  
  load_more: ->
    @$models.Assignment.solved page: @next, (data) =>
      for problem in data.results
        @parseNext data.next
        @problems.push problem

  constructor: (@$models) ->
    @$models.Assignment.solved (data) =>
      @parseNext data.next
      @count = data.count
      @problems = data.results
      @doneData = data


module.exports = DoneCtrl
