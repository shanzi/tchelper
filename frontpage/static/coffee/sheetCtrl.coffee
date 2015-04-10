class sheetCtrl
  sheetData: null
  date: ''
  number: 0
  problems: ''
  has_overdue: false
  has_new: false
  has_review: false
  is_last: true
  none: false

  get_data: (data) ->
    if data.none
      @none = true
      return
    @is_last = data.is_last
    @date = data.date
    @number = data.number
    @problems = data.problems
    @tags = []
    tagMap = {}
    for problem in @problems
      tags = problem.tags.split(',')
      for tag in tags
        tag = tag.trim()
        if tag  and (!tagMap[tag])
          @tags.push tag
          tagMap[tag] = true
      switch problem.type
        when 'overdue'
          @has_overdue = true
        when 'new'
          @has_new = true
        when 'review'
          @has_review = true
        else
    @sheetData = data

  done: (problem) ->
    @$models.Assignment.done id: problem.id, (data) =>
      problem.done = true
 
  constructor: ($routeParams, @$models) ->
    @$models.Sheet.get number: $routeParams.number, (data) => @get_data(data)
      

module.exports = sheetCtrl
