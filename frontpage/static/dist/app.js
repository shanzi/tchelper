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
  DoneCtrl.prototype.doneData = null;

  DoneCtrl.prototype.next = null;

  DoneCtrl.prototype.count = 0;

  DoneCtrl.prototype.problems = [];

  DoneCtrl.prototype.parseNext = function(next) {
    var match;
    if (next) {
      match = next.match(/page=(\d+)/);
      if (match.length === 2) {
        this.next = parseInt(match[1]);
        return;
      }
    }
    return this.next = null;
  };

  DoneCtrl.prototype.load_more = function() {
    return this.$models.Assignment.solved({
      page: this.next
    }, (function(_this) {
      return function(data) {
        var i, len, problem, ref, results;
        ref = data.results;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          problem = ref[i];
          _this.parseNext(data.next);
          results.push(_this.problems.push(problem));
        }
        return results;
      };
    })(this));
  };

  function DoneCtrl($models) {
    this.$models = $models;
    this.$models.Assignment.solved((function(_this) {
      return function(data) {
        _this.parseNext(data.next);
        _this.count = data.count;
        _this.problems = data.results;
        return _this.doneData = data;
      };
    })(this));
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
              element.removeClass('not-touching');
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
            element.addClass('not-touching');
            swipeOffset = 0;
            updateOffset();
            if (!scope.problem.done) {
              if (swipeOffset > 80) {
                return scope.action();
              }
            }
          },
          cancel: function(obj) {
            element.addClass('not-touching');
            swipeOffset = 0;
            return updateOffset();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2RvbmVDdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tb2RlbHMuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1DdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9zaGVldEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3V0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LFFBQVY7QUFBQSxFQUNBLGFBQUEsRUFBZSxhQURmO0NBUkYsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBBcHBDdHJsXG4gIGdvOiAocGF0aCkgLT5cbiAgICBAJGxvY2F0aW9uLnBhdGgocGF0aClcblxuICBjb25zdHJ1Y3RvcjogKEAkbG9jYXRpb24pIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEN0cmxcbiIsImNsYXNzIERvbmVDdHJsXG4gIGRvbmVEYXRhOiBudWxsXG4gIG5leHQ6IG51bGxcbiAgY291bnQ6IDBcbiAgcHJvYmxlbXM6IFtdXG5cbiAgcGFyc2VOZXh0OiAobmV4dCktPlxuICAgIGlmIG5leHRcbiAgICAgIG1hdGNoID0gbmV4dC5tYXRjaCAvcGFnZT0oXFxkKykvXG4gICAgICBpZiBtYXRjaC5sZW5ndGggPT0gMlxuICAgICAgICBAbmV4dCA9IHBhcnNlSW50KG1hdGNoWzFdKVxuICAgICAgICByZXR1cm5cbiAgICBAbmV4dCA9IG51bGxcbiAgXG4gIGxvYWRfbW9yZTogLT5cbiAgICBAJG1vZGVscy5Bc3NpZ25tZW50LnNvbHZlZCBwYWdlOiBAbmV4dCwgKGRhdGEpID0+XG4gICAgICBmb3IgcHJvYmxlbSBpbiBkYXRhLnJlc3VsdHNcbiAgICAgICAgQHBhcnNlTmV4dCBkYXRhLm5leHRcbiAgICAgICAgQHByb2JsZW1zLnB1c2ggcHJvYmxlbVxuXG4gIGNvbnN0cnVjdG9yOiAoQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuQXNzaWdubWVudC5zb2x2ZWQgKGRhdGEpID0+XG4gICAgICBAcGFyc2VOZXh0IGRhdGEubmV4dFxuICAgICAgQGNvdW50ID0gZGF0YS5jb3VudFxuICAgICAgQHByb2JsZW1zID0gZGF0YS5yZXN1bHRzXG4gICAgICBAZG9uZURhdGEgPSBkYXRhXG5cblxubW9kdWxlLmV4cG9ydHMgPSBEb25lQ3RybFxuIiwidXRpbHMgPSByZXF1aXJlICcuL3V0aWxzLmNvZmZlZSdcblxuYXBwQ3RybCA9IHJlcXVpcmUgJy4vYXBwQ3RybC5jb2ZmZWUnXG5zaGVldEN0cmwgPSByZXF1aXJlICcuL3NoZWV0Q3RybC5jb2ZmZWUnXG5kb25lQ3RybCA9IHJlcXVpcmUgJy4vZG9uZUN0cmwuY29mZmVlJ1xucGVyc29uQ3RybCA9IHJlcXVpcmUgJy4vcGVyc29uQ3RybC5jb2ZmZWUnXG5wcm9ibGVtQ3RybCA9IHJlcXVpcmUgJy4vcHJvYmxlbUN0cmwuY29mZmVlJ1xuXG5wcm9ibGVtRGlyZWN0aXZlID0gcmVxdWlyZSAnLi9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSdcblxubW9kZWxzID0gcmVxdWlyZSAnLi9tb2RlbHMuY29mZmVlJ1xuXG50ZW1wbGF0ZV9wYXRoID0gdXRpbHMudGVtcGxhdGVfcGF0aFxuXG5hbmd1bGFyLm1vZHVsZSgndGNoQXBwJywgW1xuICAnbmdSb3V0ZScsXG4gICduZ1RvdWNoJyxcbiAgJ25nQW5pbWF0ZScsXG4gICduZ1Nhbml0aXplJyxcbiAgJ25nUmVzb3VyY2UnLFxuICAnYW5ndWxhci1sb2FkaW5nLWJhcicsXG5dKVxuICAuY29udHJvbGxlciAnYXBwQ3RybCcsIGFwcEN0cmxcbiAgLmNvbnRyb2xsZXIgJ3NoZWV0Q3RybCcsIHNoZWV0Q3RybFxuICAuY29udHJvbGxlciAnZG9uZUN0cmwnLCBkb25lQ3RybFxuICAuY29udHJvbGxlciAncGVyc29uQ3RybCcsIHBlcnNvbkN0cmxcbiAgLmNvbnRyb2xsZXIgJ3Byb2JsZW1DdHJsJywgcHJvYmxlbUN0cmxcblxuICAuZGlyZWN0aXZlICdwcm9ibGVtJywgcHJvYmxlbURpcmVjdGl2ZVxuXG4gIC5mYWN0b3J5ICckbW9kZWxzJywgbW9kZWxzXG5cbiAgLmNvbmZpZyAoJHJvdXRlUHJvdmlkZXIpIC0+XG4gICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgIC53aGVuICcvc2hlZXQvOm51bWJlcicsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdzaGVldEN0cmwnXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3NoZWV0J1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgnc2hlZXQuaHRtbCcpXG4gICAgICAud2hlbiAnL2RvbmUnLFxuICAgICAgICBjb250cm9sbGVyOiAnZG9uZUN0cmwnXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ2RvbmUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdkb25lLmh0bWwnKVxuICAgICAgLndoZW4gJy9wZXJzb24nLFxuICAgICAgICBjb250cm9sbGVyOiAncGVyc29uQ3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAncGVyc29uJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgncGVyc29uLmh0bWwnKVxuICAgICAgLndoZW4gJy9wcm9ibGVtLzppZCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdwcm9ibGVtQ3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAncHJvYmxlbSdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3Byb2JsZW0uaHRtbCcpXG4gICAgICAub3RoZXJ3aXNlXG4gICAgICAgIHJlZGlyZWN0VG86ICcvc2hlZXQvbGF0ZXN0J1xuXG4gIC5jb25maWcgKCRyZXNvdXJjZVByb3ZpZGVyKSAtPlxuICAgICRyZXNvdXJjZVByb3ZpZGVyLmRlZmF1bHRzLnN0cmlwVHJhaWxpbmdTbGFzaGVzID0gZmFsc2VcblxuICAuY29uZmlnICgkbG9jYXRpb25Qcm92aWRlcikgLT5cbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUgdHJ1ZVxuXG4gIC5jb25maWcgKGNmcExvYWRpbmdCYXJQcm92aWRlcikgLT5cbiAgICBjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZVxuXG4gIC5jb25maWcgKCRodHRwUHJvdmlkZXIpIC0+XG4gICAgY3NyZl90b2tlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1jc3JmLXRva2VuXScpLmNvbnRlbnRcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLUNTUkZUb2tlbiddID0gY3NyZl90b2tlblxuIiwidXRpbHMgPSByZXF1aXJlICcuL3V0aWxzLmNvZmZlZSdcblxuYXBpX3BhdGggPSB1dGlscy5hcGlfcGF0aFxuXG5tb2R1bGUuZXhwb3J0cyA9ICgkcmVzb3VyY2UpIC0+XG4gICdQcm9ibGVtJzpcbiAgICAkcmVzb3VyY2UgYXBpX3BhdGgoJy9wcm9ibGVtcy86aWQvJyksIHtpZDogJ0BpZCd9LFxuICAgICAgc3RhcnJlZDpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zL3N0YXJyZWQvJylcbiAgICAgIGhhc19zdGFyOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkL2hhc19zdGFyJylcbiAgICAgICAgcGFyYW1zOiB7aWQ6ICdAcHJvYmxlbUlkJ31cbiAgICAgIHN0YXI6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9ibGVtcy86aWQvc3Rhci8nKVxuICAgICAgICBwYXJhbXM6IHtpZDogJ0BpZCd9XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXG4gICAgICB1bnN0YXI6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9ibGVtcy86aWQvdW5zdGFyLycpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQGlkJ31cbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcblxuICAnQXNzaWdubWVudCc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvYXNzaWdubWVudHMvOmlkJyksIHtpZDogJ0BpZCd9LFxuICAgICAgc29sdmVkOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvYXNzaWdubWVudHMvc29sdmVkJylcbiAgICAgIGRvbmU6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9hc3NpZ25tZW50cy86aWQvZG9uZS8nKVxuICAgICAgICBwYXJhbXM6IHtpZDogJ0BpZCd9XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXG5cbiAgJ1NoZWV0JzpcbiAgICAkcmVzb3VyY2UgYXBpX3BhdGgoJy9zaGVldHMvOm51bWJlcicpLCB7bnVtYmVyOiAnQG51bWJlcid9XG4iLCJjbGFzcyBQZXJzb25DdHJsXG4gIGNvbnN0cnVjdG9yOiAoKSAtPlxuICAgIEB0aXRsZSA9ICdUQ0hlbHBlciB8IGFwcCdcblxubW9kdWxlLmV4cG9ydHMgPSBQZXJzb25DdHJsXG4iLCJjbGFzcyBQcm9ibGVtQ3RybFxuICBwcm9ibGVtRGF0YTogbnVsbFxuXG4gIGRhdGU6ICcnXG4gIHByb2JsZW1JZDogJydcbiAgcHJvYmxlbU5hbWU6ICcnXG4gIHByb2JsZW1TdGF0ZW1lbnQ6ICcnXG4gIHRhZ3M6IFtdXG4gIGhhc19zdGFyOiBmYWxzZVxuXG4gIGdldF9kYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0ZSA9IGRhdGEuZGF0ZVxuICAgIEBwcm9ibGVtSWQgPSBkYXRhLnByb2JsZW1JZFxuICAgIEBwcm9ibGVtTmFtZSA9IGRhdGEucHJvYmxlbU5hbWVcbiAgICBAcHJvYmxlbVN0YXRlbWVudCA9IGRhdGEucHJvYmxlbVN0YXRlbWVudFxuICAgIEB0YWdzID0gKHRhZy50cmltKCkgZm9yIHRhZyBpbiBkYXRhLnRhZ3Muc3BsaXQoJywnKSlcbiAgICBAcHJvYmxlbURhdGEgPSBkYXRhXG4gICAgQCRtb2RlbHMuUHJvYmxlbS5oYXNfc3RhciBpZDogQHByb2JsZW1JZCwgKHJlcykgPT4gQGhhc19zdGFyID0gcmVzLmhhc19zdGFyXG5cbiAgc3RhcjogLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLnN0YXIgaWQ6IEBwcm9ibGVtSWQsIChyZXMpID0+XG4gICAgICBAaGFzX3N0YXIgPSB0cnVlIGlmIHJlcy5zdGF0dXMgPT0gJ29rJ1xuXG4gIHVuc3RhcjogLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLnVuc3RhciBpZDogQHByb2JsZW1JZCwgKHJlcykgPT5cbiAgICAgIEBoYXNfc3RhciA9IGZhbHNlIGlmIHJlcy5zdGF0dXMgPT0gJ29rJ1xuXG4gIGNvbnN0cnVjdG9yOiAoJHJvdXRlUGFyYW1zLCBAJG1vZGVscykgLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLmdldCBpZDogJHJvdXRlUGFyYW1zLmlkLCAoZGF0YSkgPT4gQGdldF9kYXRhKGRhdGEpXG5cbm1vZHVsZS5leHBvcnRzID0gUHJvYmxlbUN0cmxcbiIsInRlbXBsYXRlX3BhdGggPSByZXF1aXJlKCcuL3V0aWxzLmNvZmZlZScpLnRlbXBsYXRlX3BhdGhcblxubW9kdWxlLmV4cG9ydHMgPSAoJGxvY2F0aW9uLCAkc3dpcGUpIC0+XG4gIHJlc3RyaWN0OiAnRSdcbiAgc2NvcGU6XG4gICAgdHlwZTogJz0nXG4gICAgcHJvYmxlbTogJz0nXG4gICAgYWN0aW9uOiAnJidcbiAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJy9wcm9ibGVtX2RpcmVjdGl2ZS5odG1sJylcbiAgbGluazogKHNjb3BlLCBlbGVtZW50KSAtPlxuICAgIHNjb3BlLmRldGFpbF9hY3Rpb249IC0+XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Byb2JsZW0vJyArIHNjb3BlLnByb2JsZW0ub3JpZ2luUHJvYmxlbSlcblxuICAgIGlmIHNjb3BlLmFjdGlvbiBhbmQgbm90IHNjb3BlLnByb2JsZW0uZG9uZVxuICAgICAgc2NvcGUuZG9uZV9hY3Rpb24gPSBzY29wZS5hY3Rpb25cbiAgICAgIHN3aXBlRWxlbWVudCA9IGVsZW1lbnQuY2hpbGRyZW4oKVxuICAgICAgb3JpZ2luWCA9IDBcbiAgICAgIHN3aXBlT2Zmc2V0ID0gMFxuICAgICAgY2FuY2VsaW5nT2Zmc2V0ID0gZmFsc2VcblxuICAgICAgZ2V0T2Zmc2V0ID0gKHgpIC0+XG4gICAgICAgIG9mZnNldCA9IHggLSBvcmlnaW5YXG4gICAgICAgIG9mZnNldCA9IDAgaWYgb2Zmc2V0ID4gMFxuICAgICAgICBzd2lwZU9mZnNldCA9IDEwMCAtIDEwMCAqIE1hdGgucG93KDEuMiwgb2Zmc2V0LzEwKVxuXG4gICAgICB1cGRhdGVPZmZzZXQgPSAtPlxuICAgICAgICBzd2lwZUVsZW1lbnQuYXR0ciAnc3R5bGUnLCBcIi13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoLSN7c3dpcGVPZmZzZXR9cHgsIDApO3RyYW5zZm9ybTogdHJhbnNsYXRlKC0je3N3aXBlT2Zmc2V0fXB4LCAwKVwiXG5cbiAgICAgICRzd2lwZS5iaW5kIGVsZW1lbnQsXG4gICAgICAgIHN0YXJ0OiAob2JqKSAtPlxuICAgICAgICAgIGlmIG5vdCBzY29wZS5wcm9ibGVtLmRvbmVcbiAgICAgICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ25vdC10b3VjaGluZycpXG4gICAgICAgICAgICBvcmlnaW5YID0gb2JqLnhcbiAgICAgICAgbW92ZTogKG9iaikgLT5cbiAgICAgICAgICBpZiBub3Qgc2NvcGUucHJvYmxlbS5kb25lXG4gICAgICAgICAgICBnZXRPZmZzZXQob2JqLngpXG4gICAgICAgICAgICB1cGRhdGVPZmZzZXQob2JqLngpXG4gICAgICAgIGVuZDogKG9iaikgLT5cbiAgICAgICAgICBlbGVtZW50LmFkZENsYXNzKCdub3QtdG91Y2hpbmcnKVxuICAgICAgICAgIHN3aXBlT2Zmc2V0ID0gMFxuICAgICAgICAgIHVwZGF0ZU9mZnNldCgpXG4gICAgICAgICAgaWYgbm90IHNjb3BlLnByb2JsZW0uZG9uZVxuICAgICAgICAgICAgc2NvcGUuYWN0aW9uKCkgaWYgc3dpcGVPZmZzZXQgPiA4MFxuICAgICAgICBjYW5jZWw6IChvYmopIC0+XG4gICAgICAgICAgZWxlbWVudC5hZGRDbGFzcygnbm90LXRvdWNoaW5nJylcbiAgICAgICAgICBzd2lwZU9mZnNldCA9IDBcbiAgICAgICAgICB1cGRhdGVPZmZzZXQoKVxuIiwiY2xhc3Mgc2hlZXRDdHJsXG4gIHNoZWV0RGF0YTogbnVsbFxuICBkYXRlOiAnJ1xuICBudW1iZXI6IDBcbiAgcHJvYmxlbXM6ICcnXG4gIGhhc19vdmVyZHVlOiBmYWxzZVxuICBoYXNfbmV3OiBmYWxzZVxuICBoYXNfcmV2aWV3OiBmYWxzZVxuICBpc19sYXN0OiB0cnVlXG5cbiAgZ2V0X2RhdGE6IChkYXRhKSAtPlxuICAgIEBpc19sYXN0ID0gZGF0YS5pc19sYXN0XG4gICAgQGRhdGUgPSBkYXRhLmRhdGVcbiAgICBAbnVtYmVyID0gZGF0YS5udW1iZXJcbiAgICBAcHJvYmxlbXMgPSBkYXRhLnByb2JsZW1zXG4gICAgQHRhZ3MgPSBbXVxuICAgIHRhZ01hcCA9IHt9XG4gICAgZm9yIHByb2JsZW0gaW4gQHByb2JsZW1zXG4gICAgICB0YWdzID0gcHJvYmxlbS50YWdzLnNwbGl0KCcsJylcbiAgICAgIGZvciB0YWcgaW4gdGFnc1xuICAgICAgICB0YWcgPSB0YWcudHJpbSgpXG4gICAgICAgIGlmIHRhZyAgYW5kICghdGFnTWFwW3RhZ10pXG4gICAgICAgICAgQHRhZ3MucHVzaCB0YWdcbiAgICAgICAgICB0YWdNYXBbdGFnXSA9IHRydWVcbiAgICAgIHN3aXRjaCBwcm9ibGVtLnR5cGVcbiAgICAgICAgd2hlbiAnb3ZlcmR1ZSdcbiAgICAgICAgICBAaGFzX292ZXJkdWUgPSB0cnVlXG4gICAgICAgIHdoZW4gJ25ldydcbiAgICAgICAgICBAaGFzX25ldyA9IHRydWVcbiAgICAgICAgd2hlbiAncmV2aWV3J1xuICAgICAgICAgIEBoYXNfcmV2aWV3ID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgQHNoZWV0RGF0YSA9IGRhdGFcblxuICBkb25lOiAocHJvYmxlbSkgLT5cbiAgICBAJG1vZGVscy5Bc3NpZ25tZW50LmRvbmUgaWQ6IHByb2JsZW0uaWQsIChkYXRhKSA9PlxuICAgICAgcHJvYmxlbS5kb25lID0gdHJ1ZVxuIFxuICBjb25zdHJ1Y3RvcjogKCRyb3V0ZVBhcmFtcywgQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuU2hlZXQuZ2V0IG51bWJlcjogJHJvdXRlUGFyYW1zLm51bWJlciwgKGRhdGEpID0+IEBnZXRfZGF0YShkYXRhKVxuICAgICAgXG5cbm1vZHVsZS5leHBvcnRzID0gc2hlZXRDdHJsXG4iLCJ0ZW1wbGF0ZV9wYXRoID0gKHBhdGgpIC0+XG4gIHBhdGggPz0gJydcbiAgcmV0dXJuIFRFTVBMQVRFX1BBVEhfQkFTRSArICcvJyArIHBhdGhcblxuYXBpX3BhdGggPSAocGF0aCkgLT5cbiAgcmV0dXJuIEFQSV9QQVRIX0JBU0UgKyBwYXRoXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYXBpX3BhdGg6IGFwaV9wYXRoXG4gIHRlbXBsYXRlX3BhdGg6IHRlbXBsYXRlX3BhdGhcbiJdfQ==
