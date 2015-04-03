class ProblemCtrl
  problemData: null

  date: ''
  problemId: ''
  problemName: ''
  problemStatement: ''
  tags: []
  has_star: false

  get_data: (data) ->
    @date = data.date
    @problemId = data.problemId
    @problemName = data.problemName
    @problemStatement = data.problemStatement
    @tags = (tag.trim() for tag in data.tags.split(','))
    @problemData = data
    @$models.Problem.has_star id: @problemId, (res) => @has_star = res.has_star

  star: ->
    @$models.Problem.star id: @problemId, (res) =>
      @has_star = true if res.status == 'ok'

  unstar: ->
    @$models.Problem.unstar id: @problemId, (res) =>
      @has_star = false if res.status == 'ok'

  constructor: ($routeParams, @$models) ->
    @$models.Problem.get id: $routeParams.id, (data) => @get_data(data)

module.exports = ProblemCtrl
