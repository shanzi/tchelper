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
  PersonCtrl.prototype.starData = null;

  PersonCtrl.prototype.next = null;

  PersonCtrl.prototype.starCount = 0;

  PersonCtrl.prototype.starredProblems = [];

  PersonCtrl.prototype.deactivate_path = DEACTIVATE_PATH;

  PersonCtrl.prototype.logout_path = LOGOUT_PATH;

  PersonCtrl.prototype.change_pass_path = CHANGE_PASS_PATH;

  PersonCtrl.prototype.parseNext = function(next) {
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

  PersonCtrl.prototype.load_more = function() {
    return this.$models.Problem.starred({
      page: this.next
    }, (function(_this) {
      return function(data) {
        var i, len, problem, ref, results;
        ref = data.results;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          problem = ref[i];
          _this.parseNext(data.next);
          results.push(_this.starredProblems.push(problem));
        }
        return results;
      };
    })(this));
  };

  function PersonCtrl($models) {
    this.$models = $models;
    this.$models.Problem.starred((function(_this) {
      return function(data) {
        _this.parseNext(data.next);
        _this.starCount = data.count;
        _this.starredProblems = data.results;
        return _this.starData = data;
      };
    })(this));
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
var initSwipeAction, template_path;

template_path = require('./utils.coffee').template_path;

initSwipeAction = function(scope, element, $swipe) {
  var cancelingOffset, getOffset, originX, swipeElement, swipeOffset, updateOffset;
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
      if (!scope.problem.done) {
        if (swipeOffset > 80) {
          scope.action();
        }
      }
      element.addClass('not-touching');
      swipeOffset = 0;
      return updateOffset();
    },
    cancel: function(obj) {
      element.addClass('not-touching');
      swipeOffset = 0;
      return updateOffset();
    }
  });
};

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
      scope.detail_action = function() {
        return $location.path('/problem/' + scope.problem.originProblem);
      };
      if (scope.type === 'star') {
        scope.is_star = true;
      } else {
        scope.is_assignment = true;
      }
      console.log(scope);
      if (scope.action && (!scope.problem.done) && scope.is_assignment) {
        return initSwipeAction(scope, element, $swipe);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2RvbmVDdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tb2RlbHMuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1DdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9zaGVldEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3V0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ZUFDdkMsT0FBTyxDQUFDLElBQVIsR0FBZSxLQUR3QjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpDLEVBREk7RUFBQSxDQWpDTixDQUFBOztBQXFDYSxFQUFBLG1CQUFDLFlBQUQsRUFBZSxPQUFmLEdBQUE7QUFDWCxJQUQwQixJQUFDLENBQUEsVUFBRCxPQUMxQixDQUFBO0FBQUEsSUFBQSxJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFmLENBQW1CO0FBQUEsTUFBQSxNQUFBLEVBQVEsWUFBWSxDQUFDLE1BQXJCO0tBQW5CLEVBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLElBQUQsR0FBQTtlQUFVLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUFWO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQsQ0FBQSxDQURXO0VBQUEsQ0FyQ2I7O21CQUFBOztJQURGLENBQUE7O0FBQUEsTUEwQ00sQ0FBQyxPQUFQLEdBQWlCLFNBMUNqQixDQUFBOzs7OztBQ0FBLElBQUEsdUJBQUE7O0FBQUEsYUFBQSxHQUFnQixTQUFDLElBQUQsR0FBQTs7SUFDZCxPQUFRO0dBQVI7QUFDQSxTQUFPLGtCQUFBLEdBQXFCLEdBQXJCLEdBQTJCLElBQWxDLENBRmM7QUFBQSxDQUFoQixDQUFBOztBQUFBLFFBSUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFNBQU8sYUFBQSxHQUFnQixJQUF2QixDQURTO0FBQUEsQ0FKWCxDQUFBOztBQUFBLE1BT00sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxFQUFBLFFBQUEsRUFBVSxRQUFWO0FBQUEsRUFDQSxhQUFBLEVBQWUsYUFEZjtDQVJGLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgQXBwQ3RybFxuICBnbzogKHBhdGgpIC0+XG4gICAgQCRsb2NhdGlvbi5wYXRoKHBhdGgpXG5cbiAgY29uc3RydWN0b3I6IChAJGxvY2F0aW9uKSAtPlxuICAgIEB0aXRsZSA9ICdUQ0hlbHBlciB8IGFwcCdcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBDdHJsXG4iLCJjbGFzcyBEb25lQ3RybFxuICBkb25lRGF0YTogbnVsbFxuICBuZXh0OiBudWxsXG4gIGNvdW50OiAwXG4gIHByb2JsZW1zOiBbXVxuXG4gIHBhcnNlTmV4dDogKG5leHQpLT5cbiAgICBpZiBuZXh0XG4gICAgICBtYXRjaCA9IG5leHQubWF0Y2ggL3BhZ2U9KFxcZCspL1xuICAgICAgaWYgbWF0Y2gubGVuZ3RoID09IDJcbiAgICAgICAgQG5leHQgPSBwYXJzZUludChtYXRjaFsxXSlcbiAgICAgICAgcmV0dXJuXG4gICAgQG5leHQgPSBudWxsXG4gIFxuICBsb2FkX21vcmU6IC0+XG4gICAgQCRtb2RlbHMuQXNzaWdubWVudC5zb2x2ZWQgcGFnZTogQG5leHQsIChkYXRhKSA9PlxuICAgICAgZm9yIHByb2JsZW0gaW4gZGF0YS5yZXN1bHRzXG4gICAgICAgIEBwYXJzZU5leHQgZGF0YS5uZXh0XG4gICAgICAgIEBwcm9ibGVtcy5wdXNoIHByb2JsZW1cblxuICBjb25zdHJ1Y3RvcjogKEAkbW9kZWxzKSAtPlxuICAgIEAkbW9kZWxzLkFzc2lnbm1lbnQuc29sdmVkIChkYXRhKSA9PlxuICAgICAgQHBhcnNlTmV4dCBkYXRhLm5leHRcbiAgICAgIEBjb3VudCA9IGRhdGEuY291bnRcbiAgICAgIEBwcm9ibGVtcyA9IGRhdGEucmVzdWx0c1xuICAgICAgQGRvbmVEYXRhID0gZGF0YVxuXG5cbm1vZHVsZS5leHBvcnRzID0gRG9uZUN0cmxcbiIsInV0aWxzID0gcmVxdWlyZSAnLi91dGlscy5jb2ZmZWUnXG5cbmFwcEN0cmwgPSByZXF1aXJlICcuL2FwcEN0cmwuY29mZmVlJ1xuc2hlZXRDdHJsID0gcmVxdWlyZSAnLi9zaGVldEN0cmwuY29mZmVlJ1xuZG9uZUN0cmwgPSByZXF1aXJlICcuL2RvbmVDdHJsLmNvZmZlZSdcbnBlcnNvbkN0cmwgPSByZXF1aXJlICcuL3BlcnNvbkN0cmwuY29mZmVlJ1xucHJvYmxlbUN0cmwgPSByZXF1aXJlICcuL3Byb2JsZW1DdHJsLmNvZmZlZSdcblxucHJvYmxlbURpcmVjdGl2ZSA9IHJlcXVpcmUgJy4vcHJvYmxlbURpcmVjdGl2ZS5jb2ZmZWUnXG5cbm1vZGVscyA9IHJlcXVpcmUgJy4vbW9kZWxzLmNvZmZlZSdcblxudGVtcGxhdGVfcGF0aCA9IHV0aWxzLnRlbXBsYXRlX3BhdGhcblxuYW5ndWxhci5tb2R1bGUoJ3RjaEFwcCcsIFtcbiAgJ25nUm91dGUnLFxuICAnbmdUb3VjaCcsXG4gICduZ0FuaW1hdGUnLFxuICAnbmdTYW5pdGl6ZScsXG4gICduZ1Jlc291cmNlJyxcbiAgJ2FuZ3VsYXItbG9hZGluZy1iYXInLFxuXSlcbiAgLmNvbnRyb2xsZXIgJ2FwcEN0cmwnLCBhcHBDdHJsXG4gIC5jb250cm9sbGVyICdzaGVldEN0cmwnLCBzaGVldEN0cmxcbiAgLmNvbnRyb2xsZXIgJ2RvbmVDdHJsJywgZG9uZUN0cmxcbiAgLmNvbnRyb2xsZXIgJ3BlcnNvbkN0cmwnLCBwZXJzb25DdHJsXG4gIC5jb250cm9sbGVyICdwcm9ibGVtQ3RybCcsIHByb2JsZW1DdHJsXG5cbiAgLmRpcmVjdGl2ZSAncHJvYmxlbScsIHByb2JsZW1EaXJlY3RpdmVcblxuICAuZmFjdG9yeSAnJG1vZGVscycsIG1vZGVsc1xuXG4gIC5jb25maWcgKCRyb3V0ZVByb3ZpZGVyKSAtPlxuICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAud2hlbiAnL3NoZWV0LzpudW1iZXInLFxuICAgICAgICBjb250cm9sbGVyOiAnc2hlZXRDdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdzaGVldCdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3NoZWV0Lmh0bWwnKVxuICAgICAgLndoZW4gJy9kb25lJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2RvbmVDdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdkb25lJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgnZG9uZS5odG1sJylcbiAgICAgIC53aGVuICcvcGVyc29uJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3BlcnNvbkN0cmwnXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3BlcnNvbidcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3BlcnNvbi5odG1sJylcbiAgICAgIC53aGVuICcvcHJvYmxlbS86aWQnLFxuICAgICAgICBjb250cm9sbGVyOiAncHJvYmxlbUN0cmwnXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3Byb2JsZW0nXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdwcm9ibGVtLmh0bWwnKVxuICAgICAgLm90aGVyd2lzZVxuICAgICAgICByZWRpcmVjdFRvOiAnL3NoZWV0L2xhdGVzdCdcblxuICAuY29uZmlnICgkcmVzb3VyY2VQcm92aWRlcikgLT5cbiAgICAkcmVzb3VyY2VQcm92aWRlci5kZWZhdWx0cy5zdHJpcFRyYWlsaW5nU2xhc2hlcyA9IGZhbHNlXG5cbiAgLmNvbmZpZyAoJGxvY2F0aW9uUHJvdmlkZXIpIC0+XG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlIHRydWVcblxuICAuY29uZmlnIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpIC0+XG4gICAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVTcGlubmVyID0gZmFsc2VcblxuICAuY29uZmlnICgkaHR0cFByb3ZpZGVyKSAtPlxuICAgIGNzcmZfdG9rZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9Y3NyZi10b2tlbl0nKS5jb250ZW50XG4gICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1DU1JGVG9rZW4nXSA9IGNzcmZfdG9rZW5cbiIsInV0aWxzID0gcmVxdWlyZSAnLi91dGlscy5jb2ZmZWUnXG5cbmFwaV9wYXRoID0gdXRpbHMuYXBpX3BhdGhcblxubW9kdWxlLmV4cG9ydHMgPSAoJHJlc291cmNlKSAtPlxuICAnUHJvYmxlbSc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkLycpLCB7aWQ6ICdAaWQnfSxcbiAgICAgIHN0YXJyZWQ6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9ibGVtcy9zdGFycmVkLycpXG4gICAgICBoYXNfc3RhcjpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC9oYXNfc3RhcicpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQHByb2JsZW1JZCd9XG4gICAgICBzdGFyOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkL3N0YXIvJylcbiAgICAgICAgcGFyYW1zOiB7aWQ6ICdAaWQnfVxuICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgdW5zdGFyOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkL3Vuc3Rhci8nKVxuICAgICAgICBwYXJhbXM6IHtpZDogJ0BpZCd9XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXG5cbiAgJ0Fzc2lnbm1lbnQnOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL2Fzc2lnbm1lbnRzLzppZCcpLCB7aWQ6ICdAaWQnfSxcbiAgICAgIHNvbHZlZDpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL2Fzc2lnbm1lbnRzL3NvbHZlZCcpXG4gICAgICBkb25lOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvYXNzaWdubWVudHMvOmlkL2RvbmUvJylcbiAgICAgICAgcGFyYW1zOiB7aWQ6ICdAaWQnfVxuICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuXG4gICdTaGVldCc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvc2hlZXRzLzpudW1iZXInKSwge251bWJlcjogJ0BudW1iZXInfVxuIiwiY2xhc3MgUGVyc29uQ3RybFxuICBzdGFyRGF0YTogbnVsbFxuICBuZXh0OiBudWxsXG4gIHN0YXJDb3VudDogMFxuICBzdGFycmVkUHJvYmxlbXM6IFtdXG4gIGRlYWN0aXZhdGVfcGF0aDogREVBQ1RJVkFURV9QQVRIXG4gIGxvZ291dF9wYXRoOiBMT0dPVVRfUEFUSFxuICBjaGFuZ2VfcGFzc19wYXRoOiBDSEFOR0VfUEFTU19QQVRIXG5cbiAgcGFyc2VOZXh0OiAobmV4dCktPlxuICAgIGlmIG5leHRcbiAgICAgIG1hdGNoID0gbmV4dC5tYXRjaCAvcGFnZT0oXFxkKykvXG4gICAgICBpZiBtYXRjaC5sZW5ndGggPT0gMlxuICAgICAgICBAbmV4dCA9IHBhcnNlSW50KG1hdGNoWzFdKVxuICAgICAgICByZXR1cm5cbiAgICBAbmV4dCA9IG51bGxcbiAgXG4gIGxvYWRfbW9yZTogLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLnN0YXJyZWQgcGFnZTogQG5leHQsIChkYXRhKSA9PlxuICAgICAgZm9yIHByb2JsZW0gaW4gZGF0YS5yZXN1bHRzXG4gICAgICAgIEBwYXJzZU5leHQgZGF0YS5uZXh0XG4gICAgICAgIEBzdGFycmVkUHJvYmxlbXMucHVzaCBwcm9ibGVtXG5cbiAgY29uc3RydWN0b3I6IChAJG1vZGVscykgLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLnN0YXJyZWQgKGRhdGEpID0+XG4gICAgICBAcGFyc2VOZXh0IGRhdGEubmV4dFxuICAgICAgQHN0YXJDb3VudCA9IGRhdGEuY291bnRcbiAgICAgIEBzdGFycmVkUHJvYmxlbXMgPSBkYXRhLnJlc3VsdHNcbiAgICAgIEBzdGFyRGF0YSA9IGRhdGFcblxubW9kdWxlLmV4cG9ydHMgPSBQZXJzb25DdHJsXG4iLCJjbGFzcyBQcm9ibGVtQ3RybFxuICBwcm9ibGVtRGF0YTogbnVsbFxuXG4gIGRhdGU6ICcnXG4gIHByb2JsZW1JZDogJydcbiAgcHJvYmxlbU5hbWU6ICcnXG4gIHByb2JsZW1TdGF0ZW1lbnQ6ICcnXG4gIHRhZ3M6IFtdXG4gIGhhc19zdGFyOiBmYWxzZVxuXG4gIGdldF9kYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0ZSA9IGRhdGEuZGF0ZVxuICAgIEBwcm9ibGVtSWQgPSBkYXRhLnByb2JsZW1JZFxuICAgIEBwcm9ibGVtTmFtZSA9IGRhdGEucHJvYmxlbU5hbWVcbiAgICBAcHJvYmxlbVN0YXRlbWVudCA9IGRhdGEucHJvYmxlbVN0YXRlbWVudFxuICAgIEB0YWdzID0gKHRhZy50cmltKCkgZm9yIHRhZyBpbiBkYXRhLnRhZ3Muc3BsaXQoJywnKSlcbiAgICBAcHJvYmxlbURhdGEgPSBkYXRhXG4gICAgQCRtb2RlbHMuUHJvYmxlbS5oYXNfc3RhciBpZDogQHByb2JsZW1JZCwgKHJlcykgPT4gQGhhc19zdGFyID0gcmVzLmhhc19zdGFyXG5cbiAgc3RhcjogLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLnN0YXIgaWQ6IEBwcm9ibGVtSWQsIChyZXMpID0+XG4gICAgICBAaGFzX3N0YXIgPSB0cnVlIGlmIHJlcy5zdGF0dXMgPT0gJ29rJ1xuXG4gIHVuc3RhcjogLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLnVuc3RhciBpZDogQHByb2JsZW1JZCwgKHJlcykgPT5cbiAgICAgIEBoYXNfc3RhciA9IGZhbHNlIGlmIHJlcy5zdGF0dXMgPT0gJ29rJ1xuXG4gIGNvbnN0cnVjdG9yOiAoJHJvdXRlUGFyYW1zLCBAJG1vZGVscykgLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLmdldCBpZDogJHJvdXRlUGFyYW1zLmlkLCAoZGF0YSkgPT4gQGdldF9kYXRhKGRhdGEpXG5cbm1vZHVsZS5leHBvcnRzID0gUHJvYmxlbUN0cmxcbiIsInRlbXBsYXRlX3BhdGggPSByZXF1aXJlKCcuL3V0aWxzLmNvZmZlZScpLnRlbXBsYXRlX3BhdGhcblxuaW5pdFN3aXBlQWN0aW9uID0gKHNjb3BlLCBlbGVtZW50LCAkc3dpcGUpIC0+XG4gIHNjb3BlLmRvbmVfYWN0aW9uID0gc2NvcGUuYWN0aW9uXG4gIHN3aXBlRWxlbWVudCA9IGVsZW1lbnQuY2hpbGRyZW4oKVxuICBvcmlnaW5YID0gMFxuICBzd2lwZU9mZnNldCA9IDBcbiAgY2FuY2VsaW5nT2Zmc2V0ID0gZmFsc2VcblxuICBnZXRPZmZzZXQgPSAoeCkgLT5cbiAgICBvZmZzZXQgPSB4IC0gb3JpZ2luWFxuICAgIG9mZnNldCA9IDAgaWYgb2Zmc2V0ID4gMFxuICAgIHN3aXBlT2Zmc2V0ID0gMTAwIC0gMTAwICogTWF0aC5wb3coMS4yLCBvZmZzZXQvMTApXG5cbiAgdXBkYXRlT2Zmc2V0ID0gLT5cbiAgICBzd2lwZUVsZW1lbnQuYXR0ciAnc3R5bGUnLCBcIi13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoLSN7c3dpcGVPZmZzZXR9cHgsIDApO3RyYW5zZm9ybTogdHJhbnNsYXRlKC0je3N3aXBlT2Zmc2V0fXB4LCAwKVwiXG5cbiAgJHN3aXBlLmJpbmQgZWxlbWVudCxcbiAgICBzdGFydDogKG9iaikgLT5cbiAgICAgIGlmIG5vdCBzY29wZS5wcm9ibGVtLmRvbmVcbiAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnbm90LXRvdWNoaW5nJylcbiAgICAgICAgb3JpZ2luWCA9IG9iai54XG4gICAgbW92ZTogKG9iaikgLT5cbiAgICAgIGlmIG5vdCBzY29wZS5wcm9ibGVtLmRvbmVcbiAgICAgICAgZ2V0T2Zmc2V0KG9iai54KVxuICAgICAgICB1cGRhdGVPZmZzZXQob2JqLngpXG4gICAgZW5kOiAob2JqKSAtPlxuICAgICAgaWYgbm90IHNjb3BlLnByb2JsZW0uZG9uZVxuICAgICAgICBzY29wZS5hY3Rpb24oKSBpZiBzd2lwZU9mZnNldCA+IDgwXG4gICAgICBlbGVtZW50LmFkZENsYXNzKCdub3QtdG91Y2hpbmcnKVxuICAgICAgc3dpcGVPZmZzZXQgPSAwXG4gICAgICB1cGRhdGVPZmZzZXQoKVxuICAgIGNhbmNlbDogKG9iaikgLT5cbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ25vdC10b3VjaGluZycpXG4gICAgICBzd2lwZU9mZnNldCA9IDBcbiAgICAgIHVwZGF0ZU9mZnNldCgpXG5cbm1vZHVsZS5leHBvcnRzID0gKCRsb2NhdGlvbiwgJHN3aXBlKSAtPlxuICByZXN0cmljdDogJ0UnXG4gIHNjb3BlOlxuICAgIHR5cGU6ICc9J1xuICAgIHByb2JsZW06ICc9J1xuICAgIGFjdGlvbjogJyYnXG4gIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCcvcHJvYmxlbV9kaXJlY3RpdmUuaHRtbCcpXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50KSAtPlxuICAgIHNjb3BlLmRldGFpbF9hY3Rpb249IC0+XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Byb2JsZW0vJyArIHNjb3BlLnByb2JsZW0ub3JpZ2luUHJvYmxlbSlcblxuICAgIGlmIHNjb3BlLnR5cGUgPT0gJ3N0YXInXG4gICAgICBzY29wZS5pc19zdGFyID0gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIHNjb3BlLmlzX2Fzc2lnbm1lbnQgPSB0cnVlXG5cbiAgICBjb25zb2xlLmxvZyBzY29wZVxuXG4gICAgaWYgc2NvcGUuYWN0aW9uIGFuZCAobm90IHNjb3BlLnByb2JsZW0uZG9uZSkgYW5kIHNjb3BlLmlzX2Fzc2lnbm1lbnRcbiAgICAgIGluaXRTd2lwZUFjdGlvbihzY29wZSwgZWxlbWVudCwgJHN3aXBlKVxuIiwiY2xhc3Mgc2hlZXRDdHJsXG4gIHNoZWV0RGF0YTogbnVsbFxuICBkYXRlOiAnJ1xuICBudW1iZXI6IDBcbiAgcHJvYmxlbXM6ICcnXG4gIGhhc19vdmVyZHVlOiBmYWxzZVxuICBoYXNfbmV3OiBmYWxzZVxuICBoYXNfcmV2aWV3OiBmYWxzZVxuICBpc19sYXN0OiB0cnVlXG5cbiAgZ2V0X2RhdGE6IChkYXRhKSAtPlxuICAgIEBpc19sYXN0ID0gZGF0YS5pc19sYXN0XG4gICAgQGRhdGUgPSBkYXRhLmRhdGVcbiAgICBAbnVtYmVyID0gZGF0YS5udW1iZXJcbiAgICBAcHJvYmxlbXMgPSBkYXRhLnByb2JsZW1zXG4gICAgQHRhZ3MgPSBbXVxuICAgIHRhZ01hcCA9IHt9XG4gICAgZm9yIHByb2JsZW0gaW4gQHByb2JsZW1zXG4gICAgICB0YWdzID0gcHJvYmxlbS50YWdzLnNwbGl0KCcsJylcbiAgICAgIGZvciB0YWcgaW4gdGFnc1xuICAgICAgICB0YWcgPSB0YWcudHJpbSgpXG4gICAgICAgIGlmIHRhZyAgYW5kICghdGFnTWFwW3RhZ10pXG4gICAgICAgICAgQHRhZ3MucHVzaCB0YWdcbiAgICAgICAgICB0YWdNYXBbdGFnXSA9IHRydWVcbiAgICAgIHN3aXRjaCBwcm9ibGVtLnR5cGVcbiAgICAgICAgd2hlbiAnb3ZlcmR1ZSdcbiAgICAgICAgICBAaGFzX292ZXJkdWUgPSB0cnVlXG4gICAgICAgIHdoZW4gJ25ldydcbiAgICAgICAgICBAaGFzX25ldyA9IHRydWVcbiAgICAgICAgd2hlbiAncmV2aWV3J1xuICAgICAgICAgIEBoYXNfcmV2aWV3ID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgQHNoZWV0RGF0YSA9IGRhdGFcblxuICBkb25lOiAocHJvYmxlbSkgLT5cbiAgICBAJG1vZGVscy5Bc3NpZ25tZW50LmRvbmUgaWQ6IHByb2JsZW0uaWQsIChkYXRhKSA9PlxuICAgICAgcHJvYmxlbS5kb25lID0gdHJ1ZVxuIFxuICBjb25zdHJ1Y3RvcjogKCRyb3V0ZVBhcmFtcywgQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuU2hlZXQuZ2V0IG51bWJlcjogJHJvdXRlUGFyYW1zLm51bWJlciwgKGRhdGEpID0+IEBnZXRfZGF0YShkYXRhKVxuICAgICAgXG5cbm1vZHVsZS5leHBvcnRzID0gc2hlZXRDdHJsXG4iLCJ0ZW1wbGF0ZV9wYXRoID0gKHBhdGgpIC0+XG4gIHBhdGggPz0gJydcbiAgcmV0dXJuIFRFTVBMQVRFX1BBVEhfQkFTRSArICcvJyArIHBhdGhcblxuYXBpX3BhdGggPSAocGF0aCkgLT5cbiAgcmV0dXJuIEFQSV9QQVRIX0JBU0UgKyBwYXRoXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYXBpX3BhdGg6IGFwaV9wYXRoXG4gIHRlbXBsYXRlX3BhdGg6IHRlbXBsYXRlX3BhdGhcbiJdfQ==
