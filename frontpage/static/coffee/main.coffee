utils = require './utils.coffee'

appCtrl = require './appCtrl.coffee'
sheetCtrl = require './sheetCtrl.coffee'
doneCtrl = require './doneCtrl.coffee'
personCtrl = require './personCtrl.coffee'

problemDirective = require './problemDirective.coffee'

models = require './models.coffee'

template_path = utils.template_path

angular.module('tchApp', [
  'ngRoute',
  'ngTouch',
  'ngAnimate',
  'ngResource',
  'angular-loading-bar',
])
  .controller 'appCtrl', appCtrl
  .controller 'sheetCtrl', sheetCtrl

  .directive 'problem', problemDirective

  .factory '$models', models

  .config ($routeProvider) ->
    $routeProvider
      .when '/',
        redirectTo: '/sheet/latest'
      .when '/sheet/:number',
        controller: 'sheetCtrl'
        controllerAs: 'sheet'
        templateUrl: template_path('sheet.html')
      .when '/done',
        controller: doneCtrl
        controllerAs: 'done'
        templateUrl: template_path('done.html')
      .when '/person',
        controller: personCtrl
        controllerAs: 'person'
        templateUrl: template_path('person.html')
      .otherwise
        redirectTo: '/'

  .config ($resourceProvider) ->
    $resourceProvider.defaults.stripTrailingSlashes = false

  .config ($locationProvider) ->
    $locationProvider.html5Mode true

  .config (cfpLoadingBarProvider) ->
    cfpLoadingBarProvider.includeSpinner = false

  .config ($httpProvider) ->
    csrf_token = document.querySelector('meta[name=csrf-token]').content
    $httpProvider.defaults.headers.common['X-CSRFToken'] = csrf_token
