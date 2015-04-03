class ProblemCtrl
  problemData: null

  date: ''
  problemName: ''
  problemStatement: ''
  tags: []

  get_data: (data) ->
    @date = data.date
    @problemName = data.problemName
    @problemStatement = data.problemStatement
    @tags = (tag.trim() for tag in data.tags.split(','))
    console.log @tags
    @problemData = data

  constructor: ($routeParams, @$models) ->
    @$models.Problem.get id: $routeParams.id, (data) => @get_data(data)

module.exports = ProblemCtrl
