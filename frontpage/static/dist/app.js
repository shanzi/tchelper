(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/appCtrl.coffee":[function(require,module,exports){
var AppCtrl;

AppCtrl = (function() {
  function AppCtrl() {
    this.title = 'TCHelper | app';
  }

  return AppCtrl;

})();

module.exports = AppCtrl;



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/main.coffee":[function(require,module,exports){
var appCtrl, personCtrl, searchCtrl, sheetCtrl, template_path;

appCtrl = require('./appCtrl.coffee');

sheetCtrl = require('./sheetCtrl.coffee');

searchCtrl = require('./searchCtrl.coffee');

personCtrl = require('./personCtrl.coffee');

template_path = function(path) {
  if (path == null) {
    path = '';
  }
  return TEMPLATE_PATH_BASE + '/' + path;
};

angular.module('tchApp', ['ngRoute', 'ngTouch', 'ngAnimate', 'ngResource', 'angular-loading-bar']).controller('appCtrl', appCtrl).config(function($routeProvider, $resourceProvider, $locationProvider) {
  $routeProvider.when('/', {
    controller: sheetCtrl,
    controlerAs: 'sheet',
    templateUrl: template_path('sheet.html')
  }).when('/search', {
    controller: searchCtrl,
    controllerAs: 'search',
    templateUrl: template_path('search.html')
  }).when('/person', {
    controller: personCtrl,
    controllerAs: 'person',
    templateUrl: template_path('person.html')
  }).otherwise({
    redirectTo: '/'
  });
  return $locationProvider.html5Mode(true);
});



},{"./appCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/appCtrl.coffee","./personCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/personCtrl.coffee","./searchCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/searchCtrl.coffee","./sheetCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/sheetCtrl.coffee"}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/personCtrl.coffee":[function(require,module,exports){
var PersonCtrl;

PersonCtrl = (function() {
  function PersonCtrl() {
    this.title = 'TCHelper | app';
  }

  return PersonCtrl;

})();

module.exports = PersonCtrl;



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/searchCtrl.coffee":[function(require,module,exports){
var SearchCtrl;

SearchCtrl = (function() {
  function SearchCtrl() {
    this.title = 'TCHelper | app';
  }

  return SearchCtrl;

})();

module.exports = SearchCtrl;



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/sheetCtrl.coffee":[function(require,module,exports){
var sheetCtrl;

sheetCtrl = (function() {
  function sheetCtrl() {
    this.title = 'TCHelper | app';
  }

  return sheetCtrl;

})();

module.exports = sheetCtrl;



},{}]},{},["/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/main.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL21haW4uY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3NlYXJjaEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3NoZWV0Q3RybC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLE9BQUE7O0FBQUE7QUFDZSxFQUFBLGlCQUFBLEdBQUE7QUFDWCxJQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsZ0JBQVQsQ0FEVztFQUFBLENBQWI7O2lCQUFBOztJQURGLENBQUE7O0FBQUEsTUFJTSxDQUFDLE9BQVAsR0FBaUIsT0FKakIsQ0FBQTs7Ozs7QUNDQSxJQUFBLHlEQUFBOztBQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVIsQ0FBVixDQUFBOztBQUFBLFNBQ0EsR0FBWSxPQUFBLENBQVEsb0JBQVIsQ0FEWixDQUFBOztBQUFBLFVBRUEsR0FBYSxPQUFBLENBQVEscUJBQVIsQ0FGYixDQUFBOztBQUFBLFVBR0EsR0FBYSxPQUFBLENBQVEscUJBQVIsQ0FIYixDQUFBOztBQUFBLGFBTUEsR0FBZ0IsU0FBQyxJQUFELEdBQUE7O0lBQ2QsT0FBUTtHQUFSO0FBQ0EsU0FBTyxrQkFBQSxHQUFxQixHQUFyQixHQUEyQixJQUFsQyxDQUZjO0FBQUEsQ0FOaEIsQ0FBQTs7QUFBQSxPQVdPLENBQUMsTUFBUixDQUFlLFFBQWYsRUFBeUIsQ0FDdkIsU0FEdUIsRUFFdkIsU0FGdUIsRUFHdkIsV0FIdUIsRUFJdkIsWUFKdUIsRUFLdkIscUJBTHVCLENBQXpCLENBTUUsQ0FBQyxVQU5ILENBTWMsU0FOZCxFQU15QixPQU56QixDQU9FLENBQUMsTUFQSCxDQU9VLFNBQUMsY0FBRCxFQUFpQixpQkFBakIsRUFBb0MsaUJBQXBDLEdBQUE7QUFFTixFQUFBLGNBQ0UsQ0FBQyxJQURILENBQ1EsR0FEUixFQUVJO0FBQUEsSUFBQSxVQUFBLEVBQVksU0FBWjtBQUFBLElBQ0EsV0FBQSxFQUFhLE9BRGI7QUFBQSxJQUVBLFdBQUEsRUFBYSxhQUFBLENBQWMsWUFBZCxDQUZiO0dBRkosQ0FLRSxDQUFDLElBTEgsQ0FLUSxTQUxSLEVBTUk7QUFBQSxJQUFBLFVBQUEsRUFBWSxVQUFaO0FBQUEsSUFDQSxZQUFBLEVBQWMsUUFEZDtBQUFBLElBRUEsV0FBQSxFQUFhLGFBQUEsQ0FBYyxhQUFkLENBRmI7R0FOSixDQVNFLENBQUMsSUFUSCxDQVNRLFNBVFIsRUFVSTtBQUFBLElBQUEsVUFBQSxFQUFZLFVBQVo7QUFBQSxJQUNBLFlBQUEsRUFBYyxRQURkO0FBQUEsSUFFQSxXQUFBLEVBQWEsYUFBQSxDQUFjLGFBQWQsQ0FGYjtHQVZKLENBYUUsQ0FBQyxTQWJILENBY0k7QUFBQSxJQUFBLFVBQUEsRUFBWSxHQUFaO0dBZEosQ0FBQSxDQUFBO1NBZ0JBLGlCQUFpQixDQUFDLFNBQWxCLENBQTRCLElBQTVCLEVBbEJNO0FBQUEsQ0FQVixDQVhBLENBQUE7Ozs7O0FDREEsSUFBQSxVQUFBOztBQUFBO0FBQ2UsRUFBQSxvQkFBQSxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLGdCQUFULENBRFc7RUFBQSxDQUFiOztvQkFBQTs7SUFERixDQUFBOztBQUFBLE1BSU0sQ0FBQyxPQUFQLEdBQWlCLFVBSmpCLENBQUE7Ozs7O0FDQUEsSUFBQSxVQUFBOztBQUFBO0FBQ2UsRUFBQSxvQkFBQSxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLGdCQUFULENBRFc7RUFBQSxDQUFiOztvQkFBQTs7SUFERixDQUFBOztBQUFBLE1BSU0sQ0FBQyxPQUFQLEdBQWlCLFVBSmpCLENBQUE7Ozs7O0FDQUEsSUFBQSxTQUFBOztBQUFBO0FBQ2UsRUFBQSxtQkFBQSxHQUFBO0FBQ1gsSUFBQSxJQUFDLENBQUEsS0FBRCxHQUFTLGdCQUFULENBRFc7RUFBQSxDQUFiOzttQkFBQTs7SUFERixDQUFBOztBQUFBLE1BSU0sQ0FBQyxPQUFQLEdBQWlCLFNBSmpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgQXBwQ3RybFxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAdGl0bGUgPSAnVENIZWxwZXIgfCBhcHAnXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwQ3RybFxuIiwiXG5hcHBDdHJsID0gcmVxdWlyZSAnLi9hcHBDdHJsLmNvZmZlZSdcbnNoZWV0Q3RybCA9IHJlcXVpcmUgJy4vc2hlZXRDdHJsLmNvZmZlZSdcbnNlYXJjaEN0cmwgPSByZXF1aXJlICcuL3NlYXJjaEN0cmwuY29mZmVlJ1xucGVyc29uQ3RybCA9IHJlcXVpcmUgJy4vcGVyc29uQ3RybC5jb2ZmZWUnXG5cblxudGVtcGxhdGVfcGF0aCA9IChwYXRoKSAtPlxuICBwYXRoID89ICcnXG4gIHJldHVybiBURU1QTEFURV9QQVRIX0JBU0UgKyAnLycgKyBwYXRoXG5cblxuYW5ndWxhci5tb2R1bGUoJ3RjaEFwcCcsIFtcbiAgJ25nUm91dGUnLFxuICAnbmdUb3VjaCcsXG4gICduZ0FuaW1hdGUnLFxuICAnbmdSZXNvdXJjZScsXG4gICdhbmd1bGFyLWxvYWRpbmctYmFyJyxcbl0pLmNvbnRyb2xsZXIgJ2FwcEN0cmwnLCBhcHBDdHJsXG4gIC5jb25maWcgKCRyb3V0ZVByb3ZpZGVyLCAkcmVzb3VyY2VQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIpIC0+XG5cbiAgICAkcm91dGVQcm92aWRlclxuICAgICAgLndoZW4gJy8nLFxuICAgICAgICBjb250cm9sbGVyOiBzaGVldEN0cmxcbiAgICAgICAgY29udHJvbGVyQXM6ICdzaGVldCdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3NoZWV0Lmh0bWwnKVxuICAgICAgLndoZW4gJy9zZWFyY2gnLFxuICAgICAgICBjb250cm9sbGVyOiBzZWFyY2hDdHJsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3NlYXJjaCdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3NlYXJjaC5odG1sJylcbiAgICAgIC53aGVuICcvcGVyc29uJyxcbiAgICAgICAgY29udHJvbGxlcjogcGVyc29uQ3RybFxuICAgICAgICBjb250cm9sbGVyQXM6ICdwZXJzb24nXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdwZXJzb24uaHRtbCcpXG4gICAgICAub3RoZXJ3aXNlXG4gICAgICAgIHJlZGlyZWN0VG86ICcvJ1xuXG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlIHRydWVcbiIsImNsYXNzIFBlcnNvbkN0cmxcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBlcnNvbkN0cmxcbiIsImNsYXNzIFNlYXJjaEN0cmxcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXJjaEN0cmxcbiIsImNsYXNzIHNoZWV0Q3RybFxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAdGl0bGUgPSAnVENIZWxwZXIgfCBhcHAnXG5cbm1vZHVsZS5leHBvcnRzID0gc2hlZXRDdHJsXG4iXX0=
