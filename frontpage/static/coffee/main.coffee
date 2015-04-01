
appCtrl = require './appCtrl.coffee'
sheetCtrl = require './sheetCtrl.coffee'
searchCtrl = require './searchCtrl.coffee'
personCtrl = require './personCtrl.coffee'


template_path = (path) ->
  path ?= ''
  return TEMPLATE_PATH_BASE + '/' + path


angular.module('tchApp', [
  'ngRoute',
  'ngTouch',
  'ngAnimate',
  'ngResource',
  'angular-loading-bar',
]).controller 'appCtrl', appCtrl
  .config ($routeProvider, $resourceProvider, $locationProvider) ->

    $routeProvider
      .when '/',
        controller: sheetCtrl
        controlerAs: 'sheet'
        templateUrl: template_path('sheet.html')
      .when '/search',
        controller: searchCtrl
        controllerAs: 'search'
        templateUrl: template_path('search.html')
      .when '/person',
        controller: personCtrl
        controllerAs: 'person'
        templateUrl: template_path('person.html')
      .otherwise
        redirectTo: '/'

    $locationProvider.html5Mode true
