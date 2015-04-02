class sheetCtrl
  sheetData: null
  date: ''
  number: 0
  problems: ''
  has_overdue: false
  has_new: false
  has_review: false
  constructor: ($scope, $models) ->
    $models.Sheet.latest (data) =>
      @sheetData = data
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
            
      

module.exports = sheetCtrl
