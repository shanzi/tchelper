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
      },
      has_star: {
        url: api_path('/problems/:id/has_star'),
        params: {
          id: '@problemId'
        }
      },
      star: {
        url: api_path('/problems/:id/star/'),
        params: {
          id: '@id'
        },
        method: 'POST'
      },
      unstar: {
        url: api_path('/problems/:id/unstar/'),
        params: {
          id: '@id'
        },
        method: 'POST'
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

  ProblemCtrl.prototype.problemId = '';

  ProblemCtrl.prototype.problemName = '';

  ProblemCtrl.prototype.problemStatement = '';

  ProblemCtrl.prototype.tags = [];

  ProblemCtrl.prototype.has_star = false;

  ProblemCtrl.prototype.get_data = function(data) {
    var tag;
    this.date = data.date;
    this.problemId = data.problemId;
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
    this.problemData = data;
    return this.$models.Problem.has_star({
      id: this.problemId
    }, (function(_this) {
      return function(res) {
        return _this.has_star = res.has_star;
      };
    })(this));
  };

  ProblemCtrl.prototype.star = function() {
    return this.$models.Problem.star({
      id: this.problemId
    }, (function(_this) {
      return function(res) {
        if (res.status === 'ok') {
          return _this.has_star = true;
        }
      };
    })(this));
  };

  ProblemCtrl.prototype.unstar = function() {
    return this.$models.Problem.unstar({
      id: this.problemId
    }, (function(_this) {
      return function(res) {
        if (res.status === 'ok') {
          return _this.has_star = false;
        }
      };
    })(this));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2RvbmVDdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tb2RlbHMuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1DdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9zaGVldEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3V0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QUFDLENBQUEsVUFBRCxPQUMxQixDQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFmLENBQW1CO0FBQUEsTUFBQSxNQUFBLEVBQVEsWUFBWSxDQUFDLE1BQXJCO0tBQW5CLEVBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLElBQUQsR0FBQTtlQUFVLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUFWO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQsQ0FBQSxDQURXO0VBQUEsQ0FyQ2I7O21CQUFBOztJQURGLENBQUE7O0FBQUEsTUEwQ00sQ0FBQyxPQUFQLEdBQWlCLFNBMUNqQixDQUFBOzs7OztBQ0FBLElBQUEsdUJBQUE7O0FBQUEsYUFBQSxHQUFnQixTQUFDLElBQUQsR0FBQTs7SUFDZCxPQUFRO0dBQVI7QUFDQSxTQUFPLGtCQUFBLEdBQXFCLEdBQXJCLEdBQTJCLElBQWxDLENBRmM7QUFBQSxDQUFoQixDQUFBOztBQUFBLFFBSUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFNBQU8sYUFBQSxHQUFnQixJQUF2QixDQURTO0FBQUEsQ0FKWCxDQUFBOztBQUFBLE1BT00sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxFQUFBLFFBQUEsRUFBVSxRQUFWO0FBQUEsRUFDQSxhQUFBLEVBQWUsYUFEZjtDQVJGLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgQXBwQ3RybFxuICBnbzogKHBhdGgpIC0+XG4gICAgQCRsb2NhdGlvbi5wYXRoKHBhdGgpXG5cbiAgY29uc3RydWN0b3I6IChAJGxvY2F0aW9uKSAtPlxuICAgIEB0aXRsZSA9ICdUQ0hlbHBlciB8IGFwcCdcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBDdHJsXG4iLCJjbGFzcyBEb25lQ3RybFxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAdGl0bGUgPSAnVENIZWxwZXIgfCBhcHAnXG5cbm1vZHVsZS5leHBvcnRzID0gRG9uZUN0cmxcbiIsInV0aWxzID0gcmVxdWlyZSAnLi91dGlscy5jb2ZmZWUnXG5cbmFwcEN0cmwgPSByZXF1aXJlICcuL2FwcEN0cmwuY29mZmVlJ1xuc2hlZXRDdHJsID0gcmVxdWlyZSAnLi9zaGVldEN0cmwuY29mZmVlJ1xuZG9uZUN0cmwgPSByZXF1aXJlICcuL2RvbmVDdHJsLmNvZmZlZSdcbnBlcnNvbkN0cmwgPSByZXF1aXJlICcuL3BlcnNvbkN0cmwuY29mZmVlJ1xucHJvYmxlbUN0cmwgPSByZXF1aXJlICcuL3Byb2JsZW1DdHJsLmNvZmZlZSdcblxucHJvYmxlbURpcmVjdGl2ZSA9IHJlcXVpcmUgJy4vcHJvYmxlbURpcmVjdGl2ZS5jb2ZmZWUnXG5cbm1vZGVscyA9IHJlcXVpcmUgJy4vbW9kZWxzLmNvZmZlZSdcblxudGVtcGxhdGVfcGF0aCA9IHV0aWxzLnRlbXBsYXRlX3BhdGhcblxuYW5ndWxhci5tb2R1bGUoJ3RjaEFwcCcsIFtcbiAgJ25nUm91dGUnLFxuICAnbmdUb3VjaCcsXG4gICduZ0FuaW1hdGUnLFxuICAnbmdTYW5pdGl6ZScsXG4gICduZ1Jlc291cmNlJyxcbiAgJ2FuZ3VsYXItbG9hZGluZy1iYXInLFxuXSlcbiAgLmNvbnRyb2xsZXIgJ2FwcEN0cmwnLCBhcHBDdHJsXG4gIC5jb250cm9sbGVyICdzaGVldEN0cmwnLCBzaGVldEN0cmxcbiAgLmNvbnRyb2xsZXIgJ2RvbmVDdHJsJywgZG9uZUN0cmxcbiAgLmNvbnRyb2xsZXIgJ3BlcnNvbkN0cmwnLCBwZXJzb25DdHJsXG4gIC5jb250cm9sbGVyICdwcm9ibGVtQ3RybCcsIHByb2JsZW1DdHJsXG5cbiAgLmRpcmVjdGl2ZSAncHJvYmxlbScsIHByb2JsZW1EaXJlY3RpdmVcblxuICAuZmFjdG9yeSAnJG1vZGVscycsIG1vZGVsc1xuXG4gIC5jb25maWcgKCRyb3V0ZVByb3ZpZGVyKSAtPlxuICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAud2hlbiAnL3NoZWV0LzpudW1iZXInLFxuICAgICAgICBjb250cm9sbGVyOiAnc2hlZXRDdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdzaGVldCdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3NoZWV0Lmh0bWwnKVxuICAgICAgLndoZW4gJy9kb25lJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2RvbmVDdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdkb25lJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgnZG9uZS5odG1sJylcbiAgICAgIC53aGVuICcvcGVyc29uJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3BlcnNvbkN0cmwnXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3BlcnNvbidcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3BlcnNvbi5odG1sJylcbiAgICAgIC53aGVuICcvcHJvYmxlbS86aWQnLFxuICAgICAgICBjb250cm9sbGVyOiAncHJvYmxlbUN0cmwnXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3Byb2JsZW0nXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdwcm9ibGVtLmh0bWwnKVxuICAgICAgLm90aGVyd2lzZVxuICAgICAgICByZWRpcmVjdFRvOiAnL3NoZWV0L2xhdGVzdCdcblxuICAuY29uZmlnICgkcmVzb3VyY2VQcm92aWRlcikgLT5cbiAgICAkcmVzb3VyY2VQcm92aWRlci5kZWZhdWx0cy5zdHJpcFRyYWlsaW5nU2xhc2hlcyA9IGZhbHNlXG5cbiAgLmNvbmZpZyAoJGxvY2F0aW9uUHJvdmlkZXIpIC0+XG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlIHRydWVcblxuICAuY29uZmlnIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpIC0+XG4gICAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVTcGlubmVyID0gZmFsc2VcblxuICAuY29uZmlnICgkaHR0cFByb3ZpZGVyKSAtPlxuICAgIGNzcmZfdG9rZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9Y3NyZi10b2tlbl0nKS5jb250ZW50XG4gICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1DU1JGVG9rZW4nXSA9IGNzcmZfdG9rZW5cbiIsInV0aWxzID0gcmVxdWlyZSAnLi91dGlscy5jb2ZmZWUnXG5cbmFwaV9wYXRoID0gdXRpbHMuYXBpX3BhdGhcblxubW9kdWxlLmV4cG9ydHMgPSAoJHJlc291cmNlKSAtPlxuICAnUHJvYmxlbSc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkLycpLCB7aWQ6ICdAaWQnfSxcbiAgICAgIHN0YXJyZWQ6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9ibGVtcy9zdGFycmVkLycpXG4gICAgICBoYXNfc3RhcjpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC9oYXNfc3RhcicpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQHByb2JsZW1JZCd9XG4gICAgICBzdGFyOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkL3N0YXIvJylcbiAgICAgICAgcGFyYW1zOiB7aWQ6ICdAaWQnfVxuICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgdW5zdGFyOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkL3Vuc3Rhci8nKVxuICAgICAgICBwYXJhbXM6IHtpZDogJ0BpZCd9XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXG5cbiAgJ0Fzc2lnbm1lbnQnOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL2Fzc2lnbm1lbnRzLzppZCcpLCB7aWQ6ICdAaWQnfSxcbiAgICAgIHNvbHZlZDpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL2Fzc2lnbm1lbnRzL3NvbHZlZCcpXG4gICAgICBkb25lOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvYXNzaWdubWVudHMvOmlkL2RvbmUvJylcbiAgICAgICAgcGFyYW1zOiB7aWQ6ICdAaWQnfVxuICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuXG4gICdTaGVldCc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvc2hlZXRzLzpudW1iZXInKSwge251bWJlcjogJ0BudW1iZXInfVxuIiwiY2xhc3MgUGVyc29uQ3RybFxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAdGl0bGUgPSAnVENIZWxwZXIgfCBhcHAnXG5cbm1vZHVsZS5leHBvcnRzID0gUGVyc29uQ3RybFxuIiwiY2xhc3MgUHJvYmxlbUN0cmxcbiAgcHJvYmxlbURhdGE6IG51bGxcblxuICBkYXRlOiAnJ1xuICBwcm9ibGVtSWQ6ICcnXG4gIHByb2JsZW1OYW1lOiAnJ1xuICBwcm9ibGVtU3RhdGVtZW50OiAnJ1xuICB0YWdzOiBbXVxuICBoYXNfc3RhcjogZmFsc2VcblxuICBnZXRfZGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGUgPSBkYXRhLmRhdGVcbiAgICBAcHJvYmxlbUlkID0gZGF0YS5wcm9ibGVtSWRcbiAgICBAcHJvYmxlbU5hbWUgPSBkYXRhLnByb2JsZW1OYW1lXG4gICAgQHByb2JsZW1TdGF0ZW1lbnQgPSBkYXRhLnByb2JsZW1TdGF0ZW1lbnRcbiAgICBAdGFncyA9ICh0YWcudHJpbSgpIGZvciB0YWcgaW4gZGF0YS50YWdzLnNwbGl0KCcsJykpXG4gICAgQHByb2JsZW1EYXRhID0gZGF0YVxuICAgIEAkbW9kZWxzLlByb2JsZW0uaGFzX3N0YXIgaWQ6IEBwcm9ibGVtSWQsIChyZXMpID0+IEBoYXNfc3RhciA9IHJlcy5oYXNfc3RhclxuXG4gIHN0YXI6IC0+XG4gICAgQCRtb2RlbHMuUHJvYmxlbS5zdGFyIGlkOiBAcHJvYmxlbUlkLCAocmVzKSA9PlxuICAgICAgQGhhc19zdGFyID0gdHJ1ZSBpZiByZXMuc3RhdHVzID09ICdvaydcblxuICB1bnN0YXI6IC0+XG4gICAgQCRtb2RlbHMuUHJvYmxlbS51bnN0YXIgaWQ6IEBwcm9ibGVtSWQsIChyZXMpID0+XG4gICAgICBAaGFzX3N0YXIgPSBmYWxzZSBpZiByZXMuc3RhdHVzID09ICdvaydcblxuICBjb25zdHJ1Y3RvcjogKCRyb3V0ZVBhcmFtcywgQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuUHJvYmxlbS5nZXQgaWQ6ICRyb3V0ZVBhcmFtcy5pZCwgKGRhdGEpID0+IEBnZXRfZGF0YShkYXRhKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2JsZW1DdHJsXG4iLCJ0ZW1wbGF0ZV9wYXRoID0gcmVxdWlyZSgnLi91dGlscy5jb2ZmZWUnKS50ZW1wbGF0ZV9wYXRoXG5cbm1vZHVsZS5leHBvcnRzID0gKCRsb2NhdGlvbiwgJHN3aXBlKSAtPlxuICByZXN0cmljdDogJ0UnXG4gIHNjb3BlOlxuICAgIHR5cGU6ICc9J1xuICAgIHByb2JsZW06ICc9J1xuICAgIGFjdGlvbjogJyYnXG4gIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCcvcHJvYmxlbV9kaXJlY3RpdmUuaHRtbCcpXG4gIGxpbms6IChzY29wZSwgZWxlbWVudCkgLT5cbiAgICBzY29wZS5kZXRhaWxfYWN0aW9uPSAtPlxuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wcm9ibGVtLycgKyBzY29wZS5wcm9ibGVtLm9yaWdpblByb2JsZW0pXG5cbiAgICBpZiBzY29wZS5hY3Rpb24gYW5kIG5vdCBzY29wZS5wcm9ibGVtLmRvbmVcbiAgICAgIHNjb3BlLmRvbmVfYWN0aW9uID0gc2NvcGUuYWN0aW9uXG4gICAgICBzd2lwZUVsZW1lbnQgPSBlbGVtZW50LmNoaWxkcmVuKClcbiAgICAgIG9yaWdpblggPSAwXG4gICAgICBzd2lwZU9mZnNldCA9IDBcbiAgICAgIGNhbmNlbGluZ09mZnNldCA9IGZhbHNlXG5cbiAgICAgIGdldE9mZnNldCA9ICh4KSAtPlxuICAgICAgICBvZmZzZXQgPSB4IC0gb3JpZ2luWFxuICAgICAgICBvZmZzZXQgPSAwIGlmIG9mZnNldCA+IDBcbiAgICAgICAgc3dpcGVPZmZzZXQgPSAxMDAgLSAxMDAgKiBNYXRoLnBvdygxLjIsIG9mZnNldC8xMClcblxuICAgICAgdXBkYXRlT2Zmc2V0ID0gLT5cbiAgICAgICAgc3dpcGVFbGVtZW50LmF0dHIgJ3N0eWxlJywgXCItd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlKC0je3N3aXBlT2Zmc2V0fXB4LCAwKTt0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtI3tzd2lwZU9mZnNldH1weCwgMClcIlxuXG4gICAgICAkc3dpcGUuYmluZCBlbGVtZW50LFxuICAgICAgICBzdGFydDogKG9iaikgLT5cbiAgICAgICAgICBpZiBub3Qgc2NvcGUucHJvYmxlbS5kb25lXG4gICAgICAgICAgICBvcmlnaW5YID0gb2JqLnhcbiAgICAgICAgbW92ZTogKG9iaikgLT5cbiAgICAgICAgICBpZiBub3Qgc2NvcGUucHJvYmxlbS5kb25lXG4gICAgICAgICAgICBnZXRPZmZzZXQob2JqLngpXG4gICAgICAgICAgICB1cGRhdGVPZmZzZXQob2JqLngpXG4gICAgICAgIGVuZDogKG9iaikgLT5cbiAgICAgICAgICBpZiBub3Qgc2NvcGUucHJvYmxlbS5kb25lXG4gICAgICAgICAgICBnZXRPZmZzZXQob2JqLngpXG4gICAgICAgICAgICBzY29wZS5hY3Rpb24oKSBpZiBzd2lwZU9mZnNldCA+IDgwXG4gICAgICAgICAgICBzd2lwZU9mZnNldCA9IDBcbiAgICAgICAgICAgIHVwZGF0ZU9mZnNldChvYmoueClcbiAgICAgICAgY2FuY2VsOiAob2JqKSAtPlxuICAgICAgICAgIHN3aXBlT2Zmc2V0ID0gMFxuICAgICAgICAgIHVwZGF0ZU9mZnNldChvYmoueClcbiIsImNsYXNzIHNoZWV0Q3RybFxuICBzaGVldERhdGE6IG51bGxcbiAgZGF0ZTogJydcbiAgbnVtYmVyOiAwXG4gIHByb2JsZW1zOiAnJ1xuICBoYXNfb3ZlcmR1ZTogZmFsc2VcbiAgaGFzX25ldzogZmFsc2VcbiAgaGFzX3JldmlldzogZmFsc2VcbiAgaXNfbGFzdDogdHJ1ZVxuXG4gIGdldF9kYXRhOiAoZGF0YSkgLT5cbiAgICBAaXNfbGFzdCA9IGRhdGEuaXNfbGFzdFxuICAgIEBkYXRlID0gZGF0YS5kYXRlXG4gICAgQG51bWJlciA9IGRhdGEubnVtYmVyXG4gICAgQHByb2JsZW1zID0gZGF0YS5wcm9ibGVtc1xuICAgIEB0YWdzID0gW11cbiAgICB0YWdNYXAgPSB7fVxuICAgIGZvciBwcm9ibGVtIGluIEBwcm9ibGVtc1xuICAgICAgdGFncyA9IHByb2JsZW0udGFncy5zcGxpdCgnLCcpXG4gICAgICBmb3IgdGFnIGluIHRhZ3NcbiAgICAgICAgdGFnID0gdGFnLnRyaW0oKVxuICAgICAgICBpZiB0YWcgIGFuZCAoIXRhZ01hcFt0YWddKVxuICAgICAgICAgIEB0YWdzLnB1c2ggdGFnXG4gICAgICAgICAgdGFnTWFwW3RhZ10gPSB0cnVlXG4gICAgICBzd2l0Y2ggcHJvYmxlbS50eXBlXG4gICAgICAgIHdoZW4gJ292ZXJkdWUnXG4gICAgICAgICAgQGhhc19vdmVyZHVlID0gdHJ1ZVxuICAgICAgICB3aGVuICduZXcnXG4gICAgICAgICAgQGhhc19uZXcgPSB0cnVlXG4gICAgICAgIHdoZW4gJ3JldmlldydcbiAgICAgICAgICBAaGFzX3JldmlldyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgIEBzaGVldERhdGEgPSBkYXRhXG5cbiAgZG9uZTogKHByb2JsZW0pIC0+XG4gICAgQCRtb2RlbHMuQXNzaWdubWVudC5kb25lIGlkOiBwcm9ibGVtLmlkLCAoZGF0YSkgPT5cbiAgICAgIHByb2JsZW0uZG9uZSA9IHRydWVcbiBcbiAgY29uc3RydWN0b3I6ICgkcm91dGVQYXJhbXMsIEAkbW9kZWxzKSAtPlxuICAgIEAkbW9kZWxzLlNoZWV0LmdldCBudW1iZXI6ICRyb3V0ZVBhcmFtcy5udW1iZXIsIChkYXRhKSA9PiBAZ2V0X2RhdGEoZGF0YSlcbiAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9IHNoZWV0Q3RybFxuIiwidGVtcGxhdGVfcGF0aCA9IChwYXRoKSAtPlxuICBwYXRoID89ICcnXG4gIHJldHVybiBURU1QTEFURV9QQVRIX0JBU0UgKyAnLycgKyBwYXRoXG5cbmFwaV9wYXRoID0gKHBhdGgpIC0+XG4gIHJldHVybiBBUElfUEFUSF9CQVNFICsgcGF0aFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFwaV9wYXRoOiBhcGlfcGF0aFxuICB0ZW1wbGF0ZV9wYXRoOiB0ZW1wbGF0ZV9wYXRoXG4iXX0=
