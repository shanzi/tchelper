(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/appCtrl.coffee":[function(require,module,exports){
var AppCtrl;

AppCtrl = (function() {
  function AppCtrl() {
    this.title = 'TCHelper | app';
  }

  return AppCtrl;

})();

module.exports = AppCtrl;



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/doneCtrl.coffee":[function(require,module,exports){
var SearchCtrl;

SearchCtrl = (function() {
  function SearchCtrl() {
    this.title = 'TCHelper | app';
  }

  return SearchCtrl;

})();

module.exports = SearchCtrl;



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/main.coffee":[function(require,module,exports){
var appCtrl, doneCtrl, models, personCtrl, problemDirective, sheetCtrl, template_path, utils;

utils = require('./utils.coffee');

appCtrl = require('./appCtrl.coffee');

sheetCtrl = require('./sheetCtrl.coffee');

doneCtrl = require('./doneCtrl.coffee');

personCtrl = require('./personCtrl.coffee');

problemDirective = require('./problemDirective.coffee');

models = require('./models.coffee');

template_path = utils.template_path;

angular.module('tchApp', ['ngRoute', 'ngTouch', 'ngAnimate', 'ngResource', 'angular-loading-bar']).controller('appCtrl', appCtrl).controller('sheetCtrl', sheetCtrl).directive('problem', problemDirective).factory('$models', models).config(function($routeProvider) {
  return $routeProvider.when('/', {
    controller: 'sheetCtrl',
    controllerAs: 'sheet',
    templateUrl: template_path('sheet.html')
  }).when('/done', {
    controller: doneCtrl,
    controllerAs: 'done',
    templateUrl: template_path('done.html')
  }).when('/person', {
    controller: personCtrl,
    controllerAs: 'person',
    templateUrl: template_path('person.html')
  }).otherwise({
    redirectTo: '/'
  });
}).config(function($resourceProvider) {
  return $resourceProvider.defaults.stripTrailingSlashes = false;
}).config(function($locationProvider) {
  return $locationProvider.html5Mode(true);
}).config(function(cfpLoadingBarProvider) {
  return cfpLoadingBarProvider.includeSpinner = false;
}).config(function($httpProvider) {
  var csrf_token;
  return csrf_token = document.querySelector('meta[name=csrf-token]').content;
});



},{"./appCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/appCtrl.coffee","./doneCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/doneCtrl.coffee","./models.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/models.coffee","./personCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/personCtrl.coffee","./problemDirective.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/problemDirective.coffee","./sheetCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/sheetCtrl.coffee","./utils.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/utils.coffee"}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/models.coffee":[function(require,module,exports){
var api_path, utils;

utils = require('./utils.coffee');

api_path = utils.api_path;

module.exports = function($resource) {
  return {
    'Problem': $resource(api_path('/problems/:id/'), {
      id: '@id'
    }, {
      starred: {
        url: api_path('/problems/starred/')
      }
    }),
    'Assignment': $resource(api_path('/assignments/:id'), {
      id: '@id'
    }, {
      solved: {
        url: api_path('/assignments/solved')
      }
    }),
    'Sheet': $resource(api_path('/sheets/:number'), {
      number: '@number'
    }, {
      latest: {
        url: api_path('/sheets/latest')
      }
    })
  };
};



},{"./utils.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/utils.coffee"}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/personCtrl.coffee":[function(require,module,exports){
var PersonCtrl;

PersonCtrl = (function() {
  function PersonCtrl() {
    this.title = 'TCHelper | app';
  }

  return PersonCtrl;

})();

module.exports = PersonCtrl;



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/problemDirective.coffee":[function(require,module,exports){
var template_path;

template_path = require('./utils.coffee').template_path;

module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      type: '=',
      problem: '=',
      action: '&'
    },
    templateUrl: template_path('/problem.html')
  };
};



},{"./utils.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/utils.coffee"}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/sheetCtrl.coffee":[function(require,module,exports){
var sheetCtrl;

sheetCtrl = (function() {
  sheetCtrl.prototype.sheetData = null;

  sheetCtrl.prototype.date = '';

  sheetCtrl.prototype.number = 0;

  sheetCtrl.prototype.problems = '';

  sheetCtrl.prototype.has_overdue = false;

  sheetCtrl.prototype.has_new = false;

  sheetCtrl.prototype.has_review = false;

  function sheetCtrl($scope, $models) {
    $models.Sheet.latest((function(_this) {
      return function(data) {
        var i, j, len, len1, problem, ref, results, tag, tagMap, tags;
        _this.sheetData = data;
        _this.date = data.date;
        _this.number = data.number;
        _this.problems = data.problems;
        _this.tags = [];
        tagMap = {};
        ref = _this.problems;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          problem = ref[i];
          tags = problem.tags.split(',');
          for (j = 0, len1 = tags.length; j < len1; j++) {
            tag = tags[j];
            tag = tag.trim();
            if (tag && (!tagMap[tag])) {
              _this.tags.push(tag);
              tagMap[tag] = true;
            }
          }
          switch (problem.type) {
            case 'overdue':
              results.push(_this.has_overdue = true);
              break;
            case 'new':
              results.push(_this.has_new = true);
              break;
            case 'review':
              results.push(_this.has_review = true);
              break;
          }
        }
        return results;
      };
    })(this));
  }

  return sheetCtrl;

})();

module.exports = sheetCtrl;



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/utils.coffee":[function(require,module,exports){
var api_path, template_path;

template_path = function(path) {
  if (path == null) {
    path = '';
  }
  return TEMPLATE_PATH_BASE + '/' + path;
};

api_path = function(path) {
  return API_PATH_BASE + path;
};

module.exports = {
  api_path: api_path,
  template_path: template_path
};



},{}]},{},["/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/main.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2RvbmVDdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tb2RlbHMuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1EaXJlY3RpdmUuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3NoZWV0Q3RybC5jb2ZmZWUiLCIvVXNlcnMvQ2hhc2VfWmhhbmcvY29kZXMvcHJvamVjdHMvdGNoZWxwZXIvZnJvbnRwYWdlL3N0YXRpYy9jb2ZmZWUvdXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxPQUFBOztBQUFBO0FBQ2UsRUFBQSxpQkFBQSxHQUFBO0FBQ1gs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RixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIEFwcEN0cmxcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEN0cmxcbiIsImNsYXNzIFNlYXJjaEN0cmxcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXJjaEN0cmxcbiIsInV0aWxzID0gcmVxdWlyZSAnLi91dGlscy5jb2ZmZWUnXG5cbmFwcEN0cmwgPSByZXF1aXJlICcuL2FwcEN0cmwuY29mZmVlJ1xuc2hlZXRDdHJsID0gcmVxdWlyZSAnLi9zaGVldEN0cmwuY29mZmVlJ1xuZG9uZUN0cmwgPSByZXF1aXJlICcuL2RvbmVDdHJsLmNvZmZlZSdcbnBlcnNvbkN0cmwgPSByZXF1aXJlICcuL3BlcnNvbkN0cmwuY29mZmVlJ1xuXG5wcm9ibGVtRGlyZWN0aXZlID0gcmVxdWlyZSAnLi9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSdcblxubW9kZWxzID0gcmVxdWlyZSAnLi9tb2RlbHMuY29mZmVlJ1xuXG50ZW1wbGF0ZV9wYXRoID0gdXRpbHMudGVtcGxhdGVfcGF0aFxuXG5hbmd1bGFyLm1vZHVsZSgndGNoQXBwJywgW1xuICAnbmdSb3V0ZScsXG4gICduZ1RvdWNoJyxcbiAgJ25nQW5pbWF0ZScsXG4gICduZ1Jlc291cmNlJyxcbiAgJ2FuZ3VsYXItbG9hZGluZy1iYXInLFxuXSlcbiAgLmNvbnRyb2xsZXIgJ2FwcEN0cmwnLCBhcHBDdHJsXG4gIC5jb250cm9sbGVyICdzaGVldEN0cmwnLCBzaGVldEN0cmxcblxuICAuZGlyZWN0aXZlICdwcm9ibGVtJywgcHJvYmxlbURpcmVjdGl2ZVxuXG4gIC5mYWN0b3J5ICckbW9kZWxzJywgbW9kZWxzXG5cbiAgLmNvbmZpZyAoJHJvdXRlUHJvdmlkZXIpIC0+XG4gICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgIC53aGVuICcvJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3NoZWV0Q3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAnc2hlZXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdzaGVldC5odG1sJylcbiAgICAgIC53aGVuICcvZG9uZScsXG4gICAgICAgIGNvbnRyb2xsZXI6IGRvbmVDdHJsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ2RvbmUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdkb25lLmh0bWwnKVxuICAgICAgLndoZW4gJy9wZXJzb24nLFxuICAgICAgICBjb250cm9sbGVyOiBwZXJzb25DdHJsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3BlcnNvbidcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3BlcnNvbi5odG1sJylcbiAgICAgIC5vdGhlcndpc2VcbiAgICAgICAgcmVkaXJlY3RUbzogJy8nXG5cbiAgLmNvbmZpZyAoJHJlc291cmNlUHJvdmlkZXIpIC0+XG4gICAgJHJlc291cmNlUHJvdmlkZXIuZGVmYXVsdHMuc3RyaXBUcmFpbGluZ1NsYXNoZXMgPSBmYWxzZVxuXG4gIC5jb25maWcgKCRsb2NhdGlvblByb3ZpZGVyKSAtPlxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSB0cnVlXG5cbiAgLmNvbmZpZyAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKSAtPlxuICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlXG5cbiAgLmNvbmZpZyAoJGh0dHBQcm92aWRlcikgLT5cbiAgICBjc3JmX3Rva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPWNzcmYtdG9rZW5dJykuY29udGVudFxuIiwidXRpbHMgPSByZXF1aXJlICcuL3V0aWxzLmNvZmZlZSdcblxuYXBpX3BhdGggPSB1dGlscy5hcGlfcGF0aFxuXG5tb2R1bGUuZXhwb3J0cyA9ICgkcmVzb3VyY2UpIC0+XG4gICdQcm9ibGVtJzpcbiAgICAkcmVzb3VyY2UgYXBpX3BhdGgoJy9wcm9ibGVtcy86aWQvJyksIHtpZDogJ0BpZCd9LFxuICAgICAgc3RhcnJlZDpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zL3N0YXJyZWQvJylcblxuICAnQXNzaWdubWVudCc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvYXNzaWdubWVudHMvOmlkJyksIHtpZDogJ0BpZCd9LFxuICAgICAgc29sdmVkOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvYXNzaWdubWVudHMvc29sdmVkJylcblxuICAnU2hlZXQnOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3NoZWV0cy86bnVtYmVyJyksIHtudW1iZXI6ICdAbnVtYmVyJ30sXG4gICAgICBsYXRlc3Q6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9zaGVldHMvbGF0ZXN0JylcbiIsImNsYXNzIFBlcnNvbkN0cmxcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBlcnNvbkN0cmxcbiIsInRlbXBsYXRlX3BhdGggPSByZXF1aXJlKCcuL3V0aWxzLmNvZmZlZScpLnRlbXBsYXRlX3BhdGhcblxubW9kdWxlLmV4cG9ydHMgPSAtPlxuICByZXN0cmljdDogJ0UnXG4gIHNjb3BlOlxuICAgIHR5cGU6ICc9J1xuICAgIHByb2JsZW06ICc9J1xuICAgIGFjdGlvbjogJyYnXG4gIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCcvcHJvYmxlbS5odG1sJylcbiIsImNsYXNzIHNoZWV0Q3RybFxuICBzaGVldERhdGE6IG51bGxcbiAgZGF0ZTogJydcbiAgbnVtYmVyOiAwXG4gIHByb2JsZW1zOiAnJ1xuICBoYXNfb3ZlcmR1ZTogZmFsc2VcbiAgaGFzX25ldzogZmFsc2VcbiAgaGFzX3JldmlldzogZmFsc2VcbiAgY29uc3RydWN0b3I6ICgkc2NvcGUsICRtb2RlbHMpIC0+XG4gICAgJG1vZGVscy5TaGVldC5sYXRlc3QgKGRhdGEpID0+XG4gICAgICBAc2hlZXREYXRhID0gZGF0YVxuICAgICAgQGRhdGUgPSBkYXRhLmRhdGVcbiAgICAgIEBudW1iZXIgPSBkYXRhLm51bWJlclxuICAgICAgQHByb2JsZW1zID0gZGF0YS5wcm9ibGVtc1xuICAgICAgQHRhZ3MgPSBbXVxuICAgICAgdGFnTWFwID0ge31cbiAgICAgIGZvciBwcm9ibGVtIGluIEBwcm9ibGVtc1xuICAgICAgICB0YWdzID0gcHJvYmxlbS50YWdzLnNwbGl0KCcsJylcbiAgICAgICAgZm9yIHRhZyBpbiB0YWdzXG4gICAgICAgICAgdGFnID0gdGFnLnRyaW0oKVxuICAgICAgICAgIGlmIHRhZyAgYW5kICghdGFnTWFwW3RhZ10pXG4gICAgICAgICAgICBAdGFncy5wdXNoIHRhZ1xuICAgICAgICAgICAgdGFnTWFwW3RhZ10gPSB0cnVlXG4gICAgICAgIHN3aXRjaCBwcm9ibGVtLnR5cGVcbiAgICAgICAgICB3aGVuICdvdmVyZHVlJ1xuICAgICAgICAgICAgQGhhc19vdmVyZHVlID0gdHJ1ZVxuICAgICAgICAgIHdoZW4gJ25ldydcbiAgICAgICAgICAgIEBoYXNfbmV3ID0gdHJ1ZVxuICAgICAgICAgIHdoZW4gJ3JldmlldydcbiAgICAgICAgICAgIEBoYXNfcmV2aWV3ID0gdHJ1ZVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIFxuICAgICAgXG5cbm1vZHVsZS5leHBvcnRzID0gc2hlZXRDdHJsXG4iLCJ0ZW1wbGF0ZV9wYXRoID0gKHBhdGgpIC0+XG4gIHBhdGggPz0gJydcbiAgcmV0dXJuIFRFTVBMQVRFX1BBVEhfQkFTRSArICcvJyArIHBhdGhcblxuYXBpX3BhdGggPSAocGF0aCkgLT5cbiAgcmV0dXJuIEFQSV9QQVRIX0JBU0UgKyBwYXRoXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYXBpX3BhdGg6IGFwaV9wYXRoXG4gIHRlbXBsYXRlX3BhdGg6IHRlbXBsYXRlX3BhdGhcbiJdfQ==
