class ProblemCtrl
  problemData: null

  date: ''
  problemId: ''
  problemName: ''
  problemStatement: ''
  tags: []
  has_star: false
  comments: []
  newCommentContent: ''
  disableComment: false

  get_data: (data) ->
    @date = data.date
    @problemId = data.problemId
    @problemName = data.problemName
    @problemStatement = data.problemStatement
    @tags = (tag.trim() for tag in data.tags.split(','))
    @problemData = data
    @$models.Problem.has_star id: @problemId, (res) => @has_star = res.has_star

  get_comment_data: (data) ->
    @comments = data

  star: ->
    @$models.Problem.star id: @problemId, (res) =>
      @has_star = true if res.status == 'ok'

  unstar: ->
    @$models.Problem.unstar id: @problemId, (res) =>
      @has_star = false if res.status == 'ok'

  commentInvalid: ->
      return @newCommentContent.trim().length == 0

  comment: ->
      return if @commentInvalid()

      content = @newCommentContent.trim()
      @disableComment = true
      newComment = new @$models.Comment
        problem: @problemId
        content: content
      newComment.$save (data) =>
          @comments.unshift data
          @newCommentContent = ''
          @disableComment = false

  clearComment: ->
    @newCommentContent = ''

  constructor: ($routeParams, @$models) ->
    @$models.Problem.get id: $routeParams.id, (data) => @get_data(data)
    @$models.Comment.query problem: $routeParams.id, (data) => @get_comment_data(data)

module.exports = ProblemCtrl
