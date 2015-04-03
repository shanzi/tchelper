(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/appCtrl.coffee":[function(require,module,exports){
var AppCtrl;

AppCtrl = (function() {
  AppCtrl.prototype.go = function(path) {
    return this.$location.path(path);
  };

  function AppCtrl($location) {
    this.$location = $location;
    this.title = 'TCHelper | app';
  }

  return AppCtrl;

})();

module.exports = AppCtrl;



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/doneCtrl.coffee":[function(require,module,exports){
var DoneCtrl;

DoneCtrl = (function() {
  function DoneCtrl() {
    this.title = 'TCHelper | app';
  }

  return DoneCtrl;

})();

module.exports = DoneCtrl;



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/main.coffee":[function(require,module,exports){
var appCtrl, doneCtrl, models, personCtrl, problemCtrl, problemDirective, sheetCtrl, template_path, utils;

utils = require('./utils.coffee');

appCtrl = require('./appCtrl.coffee');

sheetCtrl = require('./sheetCtrl.coffee');

doneCtrl = require('./doneCtrl.coffee');

personCtrl = require('./personCtrl.coffee');

problemCtrl = require('./problemCtrl.coffee');

problemDirective = require('./problemDirective.coffee');

models = require('./models.coffee');

template_path = utils.template_path;

angular.module('tchApp', ['ngRoute', 'ngTouch', 'ngAnimate', 'ngSanitize', 'ngResource', 'angular-loading-bar']).controller('appCtrl', appCtrl).controller('sheetCtrl', sheetCtrl).controller('doneCtrl', doneCtrl).controller('personCtrl', personCtrl).controller('problemCtrl', problemCtrl).directive('problem', problemDirective).factory('$models', models).config(function($routeProvider) {
  return $routeProvider.when('/sheet/:number', {
    controller: 'sheetCtrl',
    controllerAs: 'sheet',
    templateUrl: template_path('sheet.html')
  }).when('/done', {
    controller: 'doneCtrl',
    controllerAs: 'done',
    templateUrl: template_path('done.html')
  }).when('/person', {
    controller: 'personCtrl',
    controllerAs: 'person',
    templateUrl: template_path('person.html')
  }).when('/problem/:id', {
    controller: 'problemCtrl',
    controllerAs: 'problem',
    templateUrl: template_path('problem.html')
  }).otherwise({
    redirectTo: '/sheet/latest'
  });
}).config(function($resourceProvider) {
  return $resourceProvider.defaults.stripTrailingSlashes = false;
}).config(function($locationProvider) {
  return $locationProvider.html5Mode(true);
}).config(function(cfpLoadingBarProvider) {
  return cfpLoadingBarProvider.includeSpinner = false;
}).config(function($httpProvider) {
  var csrf_token;
  csrf_token = document.querySelector('meta[name=csrf-token]').content;
  return $httpProvider.defaults.headers.common['X-CSRFToken'] = csrf_token;
});



},{"./appCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/appCtrl.coffee","./doneCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/doneCtrl.coffee","./models.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/models.coffee","./personCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/personCtrl.coffee","./problemCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/problemCtrl.coffee","./problemDirective.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/problemDirective.coffee","./sheetCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/sheetCtrl.coffee","./utils.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/utils.coffee"}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/models.coffee":[function(require,module,exports){
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
      },
      done: {
        url: api_path('/assignments/:id/done/'),
        params: {
          id: '@id'
        },
        method: 'POST'
      }
    }),
    'Sheet': $resource(api_path('/sheets/:number'), {
      number: '@number'
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



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/problemCtrl.coffee":[function(require,module,exports){
var ProblemCtrl;

ProblemCtrl = (function() {
  ProblemCtrl.prototype.problemData = null;

  ProblemCtrl.prototype.date = '';

  ProblemCtrl.prototype.problemName = '';

  ProblemCtrl.prototype.problemStatement = '';

  ProblemCtrl.prototype.tags = [];

  ProblemCtrl.prototype.get_data = function(data) {
    var tag;
    this.date = data.date;
    this.problemName = data.problemName;
    this.problemStatement = data.problemStatement;
    this.tags = (function() {
      var i, len, ref, results;
      ref = data.tags.split(',');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        tag = ref[i];
        results.push(tag.trim());
      }
      return results;
    })();
    console.log(this.tags);
    return this.problemData = data;
  };

  function ProblemCtrl($routeParams, $models) {
    this.$models = $models;
    this.$models.Problem.get({
      id: $routeParams.id
    }, (function(_this) {
      return function(data) {
        return _this.get_data(data);
      };
    })(this));
  }

  return ProblemCtrl;

})();

module.exports = ProblemCtrl;



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/problemDirective.coffee":[function(require,module,exports){
var template_path;

template_path = require('./utils.coffee').template_path;

module.exports = function($location, $swipe) {
  return {
    restrict: 'E',
    scope: {
      type: '=',
      problem: '=',
      action: '&'
    },
    templateUrl: template_path('/problem_directive.html'),
    link: function(scope, element) {
      var cancelingOffset, getOffset, originX, swipeElement, swipeOffset, updateOffset;
      scope.detail_action = function() {
        return $location.path('/problem/' + scope.problem.originProblem);
      };
      if (scope.action && !scope.problem.done) {
        scope.done_action = scope.action;
        swipeElement = element.children();
        originX = 0;
        swipeOffset = 0;
        cancelingOffset = false;
        getOffset = function(x) {
          var offset;
          offset = x - originX;
          if (offset > 0) {
            offset = 0;
          }
          return swipeOffset = 100 - 100 * Math.pow(1.2, offset / 10);
        };
        updateOffset = function() {
          return swipeElement.attr('style', "-webkit-transform: translate(-" + swipeOffset + "px, 0);transform: translate(-" + swipeOffset + "px, 0)");
        };
        return $swipe.bind(element, {
          start: function(obj) {
            if (!scope.problem.done) {
              return originX = obj.x;
            }
          },
          move: function(obj) {
            if (!scope.problem.done) {
              getOffset(obj.x);
              return updateOffset(obj.x);
            }
          },
          end: function(obj) {
            if (!scope.problem.done) {
              getOffset(obj.x);
              if (swipeOffset > 80) {
                scope.action();
              }
              swipeOffset = 0;
              return updateOffset(obj.x);
            }
          },
          cancel: function(obj) {
            swipeOffset = 0;
            return updateOffset(obj.x);
          }
        });
      }
    }
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

  sheetCtrl.prototype.is_last = true;

  sheetCtrl.prototype.get_data = function(data) {
    var i, j, len, len1, problem, ref, tag, tagMap, tags;
    this.is_last = data.is_last;
    this.date = data.date;
    this.number = data.number;
    this.problems = data.problems;
    this.tags = [];
    tagMap = {};
    ref = this.problems;
    for (i = 0, len = ref.length; i < len; i++) {
      problem = ref[i];
      tags = problem.tags.split(',');
      for (j = 0, len1 = tags.length; j < len1; j++) {
        tag = tags[j];
        tag = tag.trim();
        if (tag && (!tagMap[tag])) {
          this.tags.push(tag);
          tagMap[tag] = true;
        }
      }
      switch (problem.type) {
        case 'overdue':
          this.has_overdue = true;
          break;
        case 'new':
          this.has_new = true;
          break;
        case 'review':
          this.has_review = true;
          break;
      }
    }
    return this.sheetData = data;
  };

  sheetCtrl.prototype.done = function(problem) {
    return this.$models.Assignment.done({
      id: problem.id
    }, (function(_this) {
      return function(data) {
        return problem.done = true;
      };
    })(this));
  };

  function sheetCtrl($routeParams, $models) {
    this.$models = $models;
    this.$models.Sheet.get({
      number: $routeParams.number
    }, (function(_this) {
      return function(data) {
        return _this.get_data(data);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2RvbmVDdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tb2RlbHMuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1DdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9zaGVldEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3V0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QixHQUEyQixJQUFsQyxDQUZjO0FBQUEsQ0FBaEIsQ0FBQTs7QUFBQSxRQUlBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxTQUFPLGFBQUEsR0FBZ0IsSUFBdkIsQ0FEUztBQUFBLENBSlgsQ0FBQTs7QUFBQSxNQU9NLENBQUMsT0FBUCxHQUNFO0FBQUEsRUFBQSxRQUFBLEVBQVUsUUFBVjtBQUFBLEVBQ0EsYUFBQSxFQUFlLGFBRGY7Q0FSRixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIEFwcEN0cmxcbiAgZ286IChwYXRoKSAtPlxuICAgIEAkbG9jYXRpb24ucGF0aChwYXRoKVxuXG4gIGNvbnN0cnVjdG9yOiAoQCRsb2NhdGlvbikgLT5cbiAgICBAdGl0bGUgPSAnVENIZWxwZXIgfCBhcHAnXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwQ3RybFxuIiwiY2xhc3MgRG9uZUN0cmxcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IERvbmVDdHJsXG4iLCJ1dGlscyA9IHJlcXVpcmUgJy4vdXRpbHMuY29mZmVlJ1xuXG5hcHBDdHJsID0gcmVxdWlyZSAnLi9hcHBDdHJsLmNvZmZlZSdcbnNoZWV0Q3RybCA9IHJlcXVpcmUgJy4vc2hlZXRDdHJsLmNvZmZlZSdcbmRvbmVDdHJsID0gcmVxdWlyZSAnLi9kb25lQ3RybC5jb2ZmZWUnXG5wZXJzb25DdHJsID0gcmVxdWlyZSAnLi9wZXJzb25DdHJsLmNvZmZlZSdcbnByb2JsZW1DdHJsID0gcmVxdWlyZSAnLi9wcm9ibGVtQ3RybC5jb2ZmZWUnXG5cbnByb2JsZW1EaXJlY3RpdmUgPSByZXF1aXJlICcuL3Byb2JsZW1EaXJlY3RpdmUuY29mZmVlJ1xuXG5tb2RlbHMgPSByZXF1aXJlICcuL21vZGVscy5jb2ZmZWUnXG5cbnRlbXBsYXRlX3BhdGggPSB1dGlscy50ZW1wbGF0ZV9wYXRoXG5cbmFuZ3VsYXIubW9kdWxlKCd0Y2hBcHAnLCBbXG4gICduZ1JvdXRlJyxcbiAgJ25nVG91Y2gnLFxuICAnbmdBbmltYXRlJyxcbiAgJ25nU2FuaXRpemUnLFxuICAnbmdSZXNvdXJjZScsXG4gICdhbmd1bGFyLWxvYWRpbmctYmFyJyxcbl0pXG4gIC5jb250cm9sbGVyICdhcHBDdHJsJywgYXBwQ3RybFxuICAuY29udHJvbGxlciAnc2hlZXRDdHJsJywgc2hlZXRDdHJsXG4gIC5jb250cm9sbGVyICdkb25lQ3RybCcsIGRvbmVDdHJsXG4gIC5jb250cm9sbGVyICdwZXJzb25DdHJsJywgcGVyc29uQ3RybFxuICAuY29udHJvbGxlciAncHJvYmxlbUN0cmwnLCBwcm9ibGVtQ3RybFxuXG4gIC5kaXJlY3RpdmUgJ3Byb2JsZW0nLCBwcm9ibGVtRGlyZWN0aXZlXG5cbiAgLmZhY3RvcnkgJyRtb2RlbHMnLCBtb2RlbHNcblxuICAuY29uZmlnICgkcm91dGVQcm92aWRlcikgLT5cbiAgICAkcm91dGVQcm92aWRlclxuICAgICAgLndoZW4gJy9zaGVldC86bnVtYmVyJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3NoZWV0Q3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAnc2hlZXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdzaGVldC5odG1sJylcbiAgICAgIC53aGVuICcvZG9uZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdkb25lQ3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAnZG9uZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ2RvbmUuaHRtbCcpXG4gICAgICAud2hlbiAnL3BlcnNvbicsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdwZXJzb25DdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdwZXJzb24nXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdwZXJzb24uaHRtbCcpXG4gICAgICAud2hlbiAnL3Byb2JsZW0vOmlkJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3Byb2JsZW1DdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdwcm9ibGVtJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgncHJvYmxlbS5odG1sJylcbiAgICAgIC5vdGhlcndpc2VcbiAgICAgICAgcmVkaXJlY3RUbzogJy9zaGVldC9sYXRlc3QnXG5cbiAgLmNvbmZpZyAoJHJlc291cmNlUHJvdmlkZXIpIC0+XG4gICAgJHJlc291cmNlUHJvdmlkZXIuZGVmYXVsdHMuc3RyaXBUcmFpbGluZ1NsYXNoZXMgPSBmYWxzZVxuXG4gIC5jb25maWcgKCRsb2NhdGlvblByb3ZpZGVyKSAtPlxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSB0cnVlXG5cbiAgLmNvbmZpZyAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKSAtPlxuICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlXG5cbiAgLmNvbmZpZyAoJGh0dHBQcm92aWRlcikgLT5cbiAgICBjc3JmX3Rva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPWNzcmYtdG9rZW5dJykuY29udGVudFxuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQ1NSRlRva2VuJ10gPSBjc3JmX3Rva2VuXG4iLCJ1dGlscyA9IHJlcXVpcmUgJy4vdXRpbHMuY29mZmVlJ1xuXG5hcGlfcGF0aCA9IHV0aWxzLmFwaV9wYXRoXG5cbm1vZHVsZS5leHBvcnRzID0gKCRyZXNvdXJjZSkgLT5cbiAgJ1Byb2JsZW0nOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC8nKSwge2lkOiAnQGlkJ30sXG4gICAgICBzdGFycmVkOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvc3RhcnJlZC8nKVxuXG4gICdBc3NpZ25tZW50JzpcbiAgICAkcmVzb3VyY2UgYXBpX3BhdGgoJy9hc3NpZ25tZW50cy86aWQnKSwge2lkOiAnQGlkJ30sXG4gICAgICBzb2x2ZWQ6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9hc3NpZ25tZW50cy9zb2x2ZWQnKVxuICAgICAgZG9uZTpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL2Fzc2lnbm1lbnRzLzppZC9kb25lLycpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQGlkJ31cbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcblxuICAnU2hlZXQnOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3NoZWV0cy86bnVtYmVyJyksIHtudW1iZXI6ICdAbnVtYmVyJ31cbiIsImNsYXNzIFBlcnNvbkN0cmxcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBlcnNvbkN0cmxcbiIsImNsYXNzIFByb2JsZW1DdHJsXG4gIHByb2JsZW1EYXRhOiBudWxsXG5cbiAgZGF0ZTogJydcbiAgcHJvYmxlbU5hbWU6ICcnXG4gIHByb2JsZW1TdGF0ZW1lbnQ6ICcnXG4gIHRhZ3M6IFtdXG5cbiAgZ2V0X2RhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRlID0gZGF0YS5kYXRlXG4gICAgQHByb2JsZW1OYW1lID0gZGF0YS5wcm9ibGVtTmFtZVxuICAgIEBwcm9ibGVtU3RhdGVtZW50ID0gZGF0YS5wcm9ibGVtU3RhdGVtZW50XG4gICAgQHRhZ3MgPSAodGFnLnRyaW0oKSBmb3IgdGFnIGluIGRhdGEudGFncy5zcGxpdCgnLCcpKVxuICAgIGNvbnNvbGUubG9nIEB0YWdzXG4gICAgQHByb2JsZW1EYXRhID0gZGF0YVxuXG4gIGNvbnN0cnVjdG9yOiAoJHJvdXRlUGFyYW1zLCBAJG1vZGVscykgLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLmdldCBpZDogJHJvdXRlUGFyYW1zLmlkLCAoZGF0YSkgPT4gQGdldF9kYXRhKGRhdGEpXG5cbm1vZHVsZS5leHBvcnRzID0gUHJvYmxlbUN0cmxcbiIsInRlbXBsYXRlX3BhdGggPSByZXF1aXJlKCcuL3V0aWxzLmNvZmZlZScpLnRlbXBsYXRlX3BhdGhcblxubW9kdWxlLmV4cG9ydHMgPSAoJGxvY2F0aW9uLCAkc3dpcGUpIC0+XG4gIHJlc3RyaWN0OiAnRSdcbiAgc2NvcGU6XG4gICAgdHlwZTogJz0nXG4gICAgcHJvYmxlbTogJz0nXG4gICAgYWN0aW9uOiAnJidcbiAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJy9wcm9ibGVtX2RpcmVjdGl2ZS5odG1sJylcbiAgbGluazogKHNjb3BlLCBlbGVtZW50KSAtPlxuICAgIHNjb3BlLmRldGFpbF9hY3Rpb249IC0+XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Byb2JsZW0vJyArIHNjb3BlLnByb2JsZW0ub3JpZ2luUHJvYmxlbSlcblxuICAgIGlmIHNjb3BlLmFjdGlvbiBhbmQgbm90IHNjb3BlLnByb2JsZW0uZG9uZVxuICAgICAgc2NvcGUuZG9uZV9hY3Rpb24gPSBzY29wZS5hY3Rpb25cbiAgICAgIHN3aXBlRWxlbWVudCA9IGVsZW1lbnQuY2hpbGRyZW4oKVxuICAgICAgb3JpZ2luWCA9IDBcbiAgICAgIHN3aXBlT2Zmc2V0ID0gMFxuICAgICAgY2FuY2VsaW5nT2Zmc2V0ID0gZmFsc2VcblxuICAgICAgZ2V0T2Zmc2V0ID0gKHgpIC0+XG4gICAgICAgIG9mZnNldCA9IHggLSBvcmlnaW5YXG4gICAgICAgIG9mZnNldCA9IDAgaWYgb2Zmc2V0ID4gMFxuICAgICAgICBzd2lwZU9mZnNldCA9IDEwMCAtIDEwMCAqIE1hdGgucG93KDEuMiwgb2Zmc2V0LzEwKVxuXG4gICAgICB1cGRhdGVPZmZzZXQgPSAtPlxuICAgICAgICBzd2lwZUVsZW1lbnQuYXR0ciAnc3R5bGUnLCBcIi13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoLSN7c3dpcGVPZmZzZXR9cHgsIDApO3RyYW5zZm9ybTogdHJhbnNsYXRlKC0je3N3aXBlT2Zmc2V0fXB4LCAwKVwiXG5cbiAgICAgICRzd2lwZS5iaW5kIGVsZW1lbnQsXG4gICAgICAgIHN0YXJ0OiAob2JqKSAtPlxuICAgICAgICAgIGlmIG5vdCBzY29wZS5wcm9ibGVtLmRvbmVcbiAgICAgICAgICAgIG9yaWdpblggPSBvYmoueFxuICAgICAgICBtb3ZlOiAob2JqKSAtPlxuICAgICAgICAgIGlmIG5vdCBzY29wZS5wcm9ibGVtLmRvbmVcbiAgICAgICAgICAgIGdldE9mZnNldChvYmoueClcbiAgICAgICAgICAgIHVwZGF0ZU9mZnNldChvYmoueClcbiAgICAgICAgZW5kOiAob2JqKSAtPlxuICAgICAgICAgIGlmIG5vdCBzY29wZS5wcm9ibGVtLmRvbmVcbiAgICAgICAgICAgIGdldE9mZnNldChvYmoueClcbiAgICAgICAgICAgIHNjb3BlLmFjdGlvbigpIGlmIHN3aXBlT2Zmc2V0ID4gODBcbiAgICAgICAgICAgIHN3aXBlT2Zmc2V0ID0gMFxuICAgICAgICAgICAgdXBkYXRlT2Zmc2V0KG9iai54KVxuICAgICAgICBjYW5jZWw6IChvYmopIC0+XG4gICAgICAgICAgc3dpcGVPZmZzZXQgPSAwXG4gICAgICAgICAgdXBkYXRlT2Zmc2V0KG9iai54KVxuIiwiY2xhc3Mgc2hlZXRDdHJsXG4gIHNoZWV0RGF0YTogbnVsbFxuICBkYXRlOiAnJ1xuICBudW1iZXI6IDBcbiAgcHJvYmxlbXM6ICcnXG4gIGhhc19vdmVyZHVlOiBmYWxzZVxuICBoYXNfbmV3OiBmYWxzZVxuICBoYXNfcmV2aWV3OiBmYWxzZVxuICBpc19sYXN0OiB0cnVlXG5cbiAgZ2V0X2RhdGE6IChkYXRhKSAtPlxuICAgIEBpc19sYXN0ID0gZGF0YS5pc19sYXN0XG4gICAgQGRhdGUgPSBkYXRhLmRhdGVcbiAgICBAbnVtYmVyID0gZGF0YS5udW1iZXJcbiAgICBAcHJvYmxlbXMgPSBkYXRhLnByb2JsZW1zXG4gICAgQHRhZ3MgPSBbXVxuICAgIHRhZ01hcCA9IHt9XG4gICAgZm9yIHByb2JsZW0gaW4gQHByb2JsZW1zXG4gICAgICB0YWdzID0gcHJvYmxlbS50YWdzLnNwbGl0KCcsJylcbiAgICAgIGZvciB0YWcgaW4gdGFnc1xuICAgICAgICB0YWcgPSB0YWcudHJpbSgpXG4gICAgICAgIGlmIHRhZyAgYW5kICghdGFnTWFwW3RhZ10pXG4gICAgICAgICAgQHRhZ3MucHVzaCB0YWdcbiAgICAgICAgICB0YWdNYXBbdGFnXSA9IHRydWVcbiAgICAgIHN3aXRjaCBwcm9ibGVtLnR5cGVcbiAgICAgICAgd2hlbiAnb3ZlcmR1ZSdcbiAgICAgICAgICBAaGFzX292ZXJkdWUgPSB0cnVlXG4gICAgICAgIHdoZW4gJ25ldydcbiAgICAgICAgICBAaGFzX25ldyA9IHRydWVcbiAgICAgICAgd2hlbiAncmV2aWV3J1xuICAgICAgICAgIEBoYXNfcmV2aWV3ID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgQHNoZWV0RGF0YSA9IGRhdGFcblxuICBkb25lOiAocHJvYmxlbSkgLT5cbiAgICBAJG1vZGVscy5Bc3NpZ25tZW50LmRvbmUgaWQ6IHByb2JsZW0uaWQsIChkYXRhKSA9PlxuICAgICAgcHJvYmxlbS5kb25lID0gdHJ1ZVxuIFxuICBjb25zdHJ1Y3RvcjogKCRyb3V0ZVBhcmFtcywgQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuU2hlZXQuZ2V0IG51bWJlcjogJHJvdXRlUGFyYW1zLm51bWJlciwgKGRhdGEpID0+IEBnZXRfZGF0YShkYXRhKVxuICAgICAgXG5cbm1vZHVsZS5leHBvcnRzID0gc2hlZXRDdHJsXG4iLCJ0ZW1wbGF0ZV9wYXRoID0gKHBhdGgpIC0+XG4gIHBhdGggPz0gJydcbiAgcmV0dXJuIFRFTVBMQVRFX1BBVEhfQkFTRSArICcvJyArIHBhdGhcblxuYXBpX3BhdGggPSAocGF0aCkgLT5cbiAgcmV0dXJuIEFQSV9QQVRIX0JBU0UgKyBwYXRoXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYXBpX3BhdGg6IGFwaV9wYXRoXG4gIHRlbXBsYXRlX3BhdGg6IHRlbXBsYXRlX3BhdGhcbiJdfQ==
