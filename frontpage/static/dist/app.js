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

angular.module('tchApp', ['ngRoute', 'ngTouch', 'ngAnimate', 'ngSanitize', 'ngResource', 'angular-loading-bar', 'monospaced.elastic', 'ui.gravatar']).controller('appCtrl', appCtrl).controller('sheetCtrl', sheetCtrl).controller('doneCtrl', doneCtrl).controller('personCtrl', personCtrl).controller('problemCtrl', problemCtrl).directive('problem', problemDirective).factory('$models', models).config(function($routeProvider) {
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
    }),
    'Comment': $resource(api_path('/comments/'), {}),
    'Profile': $resource(api_path('/profile/:id'), {
      id: '@id'
    }, {
      me: {
        url: api_path('/profile/me/')
      },
      update: {
        url: api_path('/profile/:id'),
        params: {
          id: '@id'
        },
        method: 'PATCH'
      }
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

  PersonCtrl.prototype.profileData = null;

  PersonCtrl.prototype.difficulty = 2;

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

  PersonCtrl.prototype.save_difficulty = function() {
    this.profileData.difficulty = this.difficulty;
    return this.profileData.$update();
  };

  PersonCtrl.prototype.readable_difficulty = function() {
    switch (parseInt(this.difficulty)) {
      case 0:
        return 'Very Easy';
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      case 4:
        return 'Very Hard';
    }
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
    this.$models.Profile.me((function(_this) {
      return function(data) {
        _this.difficulty = data.difficulty;
        return _this.profileData = data;
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

  ProblemCtrl.prototype.matchName = '';

  ProblemCtrl.prototype.tags = [];

  ProblemCtrl.prototype.has_star = false;

  ProblemCtrl.prototype.comments = [];

  ProblemCtrl.prototype.newCommentContent = '';

  ProblemCtrl.prototype.disableComment = false;

  ProblemCtrl.prototype.get_data = function(data) {
    var tag;
    this.date = data.date;
    this.problemId = data.problemId;
    this.problemName = data.problemName;
    this.problemStatement = data.problemStatement;
    this.matchName = data.matchName;
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

  ProblemCtrl.prototype.get_comment_data = function(data) {
    return this.comments = data;
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

  ProblemCtrl.prototype.commentInvalid = function() {
    return this.newCommentContent.trim().length === 0;
  };

  ProblemCtrl.prototype.comment = function() {
    var content, newComment;
    if (this.commentInvalid()) {
      return;
    }
    content = this.newCommentContent.trim();
    this.disableComment = true;
    newComment = new this.$models.Comment({
      problem: this.problemId,
      content: content
    });
    return newComment.$save((function(_this) {
      return function(data) {
        _this.comments.unshift(data);
        _this.newCommentContent = '';
        return _this.disableComment = false;
      };
    })(this));
  };

  ProblemCtrl.prototype.clearComment = function() {
    return this.newCommentContent = '';
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
    this.$models.Comment.query({
      problem: $routeParams.id
    }, (function(_this) {
      return function(data) {
        return _this.get_comment_data(data);
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

  sheetCtrl.prototype.none = false;

  sheetCtrl.prototype.get_data = function(data) {
    var i, j, len, len1, problem, ref, tag, tagMap, tags;
    if (data.none) {
      this.none = true;
      return;
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2RvbmVDdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tb2RlbHMuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1DdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9zaGVldEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3V0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QSxNQUFBLEVBQVEsWUFBWSxDQUFDLE1BQXJCO0tBQW5CLEVBQWdELENBQUEsU0FBQSxLQUFBLEdBQUE7YUFBQSxTQUFDLElBQUQsR0FBQTtlQUFVLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBVixFQUFWO01BQUEsRUFBQTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEQsQ0FBQSxDQURXO0VBQUEsQ0F6Q2I7O21CQUFBOztJQURGLENBQUE7O0FBQUEsTUE4Q00sQ0FBQyxPQUFQLEdBQWlCLFNBOUNqQixDQUFBOzs7OztBQ0FBLElBQUEsdUJBQUE7O0FBQUEsYUFBQSxHQUFnQixTQUFDLElBQUQsR0FBQTs7SUFDZCxPQUFRO0dBQVI7QUFDQSxTQUFPLGtCQUFBLEdBQXFCLEdBQXJCLEdBQTJCLElBQWxDLENBRmM7QUFBQSxDQUFoQixDQUFBOztBQUFBLFFBSUEsR0FBVyxTQUFDLElBQUQsR0FBQTtBQUNULFNBQU8sYUFBQSxHQUFnQixJQUF2QixDQURTO0FBQUEsQ0FKWCxDQUFBOztBQUFBLE1BT00sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxFQUFBLFFBQUEsRUFBVSxRQUFWO0FBQUEsRUFDQSxhQUFBLEVBQWUsYUFEZjtDQVJGLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgQXBwQ3RybFxuICBnbzogKHBhdGgpIC0+XG4gICAgQCRsb2NhdGlvbi5wYXRoKHBhdGgpXG5cbiAgY29uc3RydWN0b3I6IChAJGxvY2F0aW9uKSAtPlxuICAgIEB0aXRsZSA9ICdUQ0hlbHBlciB8IGFwcCdcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBDdHJsXG4iLCJjbGFzcyBEb25lQ3RybFxuICBkb25lRGF0YTogbnVsbFxuICBuZXh0OiBudWxsXG4gIGNvdW50OiAwXG4gIHByb2JsZW1zOiBbXVxuXG4gIHBhcnNlTmV4dDogKG5leHQpLT5cbiAgICBpZiBuZXh0XG4gICAgICBtYXRjaCA9IG5leHQubWF0Y2ggL3BhZ2U9KFxcZCspL1xuICAgICAgaWYgbWF0Y2gubGVuZ3RoID09IDJcbiAgICAgICAgQG5leHQgPSBwYXJzZUludChtYXRjaFsxXSlcbiAgICAgICAgcmV0dXJuXG4gICAgQG5leHQgPSBudWxsXG4gIFxuICBsb2FkX21vcmU6IC0+XG4gICAgQCRtb2RlbHMuQXNzaWdubWVudC5zb2x2ZWQgcGFnZTogQG5leHQsIChkYXRhKSA9PlxuICAgICAgZm9yIHByb2JsZW0gaW4gZGF0YS5yZXN1bHRzXG4gICAgICAgIEBwYXJzZU5leHQgZGF0YS5uZXh0XG4gICAgICAgIEBwcm9ibGVtcy5wdXNoIHByb2JsZW1cblxuICBjb25zdHJ1Y3RvcjogKEAkbW9kZWxzKSAtPlxuICAgIEAkbW9kZWxzLkFzc2lnbm1lbnQuc29sdmVkIChkYXRhKSA9PlxuICAgICAgQHBhcnNlTmV4dCBkYXRhLm5leHRcbiAgICAgIEBjb3VudCA9IGRhdGEuY291bnRcbiAgICAgIEBwcm9ibGVtcyA9IGRhdGEucmVzdWx0c1xuICAgICAgQGRvbmVEYXRhID0gZGF0YVxuXG5cbm1vZHVsZS5leHBvcnRzID0gRG9uZUN0cmxcbiIsInV0aWxzID0gcmVxdWlyZSAnLi91dGlscy5jb2ZmZWUnXG5cbmFwcEN0cmwgPSByZXF1aXJlICcuL2FwcEN0cmwuY29mZmVlJ1xuc2hlZXRDdHJsID0gcmVxdWlyZSAnLi9zaGVldEN0cmwuY29mZmVlJ1xuZG9uZUN0cmwgPSByZXF1aXJlICcuL2RvbmVDdHJsLmNvZmZlZSdcbnBlcnNvbkN0cmwgPSByZXF1aXJlICcuL3BlcnNvbkN0cmwuY29mZmVlJ1xucHJvYmxlbUN0cmwgPSByZXF1aXJlICcuL3Byb2JsZW1DdHJsLmNvZmZlZSdcblxucHJvYmxlbURpcmVjdGl2ZSA9IHJlcXVpcmUgJy4vcHJvYmxlbURpcmVjdGl2ZS5jb2ZmZWUnXG5cbm1vZGVscyA9IHJlcXVpcmUgJy4vbW9kZWxzLmNvZmZlZSdcblxudGVtcGxhdGVfcGF0aCA9IHV0aWxzLnRlbXBsYXRlX3BhdGhcblxuYW5ndWxhci5tb2R1bGUoJ3RjaEFwcCcsIFtcbiAgJ25nUm91dGUnLFxuICAnbmdUb3VjaCcsXG4gICduZ0FuaW1hdGUnLFxuICAnbmdTYW5pdGl6ZScsXG4gICduZ1Jlc291cmNlJyxcbiAgJ2FuZ3VsYXItbG9hZGluZy1iYXInLFxuICAnbW9ub3NwYWNlZC5lbGFzdGljJyxcbiAgJ3VpLmdyYXZhdGFyJyxcbl0pXG4gIC5jb250cm9sbGVyICdhcHBDdHJsJywgYXBwQ3RybFxuICAuY29udHJvbGxlciAnc2hlZXRDdHJsJywgc2hlZXRDdHJsXG4gIC5jb250cm9sbGVyICdkb25lQ3RybCcsIGRvbmVDdHJsXG4gIC5jb250cm9sbGVyICdwZXJzb25DdHJsJywgcGVyc29uQ3RybFxuICAuY29udHJvbGxlciAncHJvYmxlbUN0cmwnLCBwcm9ibGVtQ3RybFxuXG4gIC5kaXJlY3RpdmUgJ3Byb2JsZW0nLCBwcm9ibGVtRGlyZWN0aXZlXG5cbiAgLmZhY3RvcnkgJyRtb2RlbHMnLCBtb2RlbHNcblxuICAuY29uZmlnICgkcm91dGVQcm92aWRlcikgLT5cbiAgICAkcm91dGVQcm92aWRlclxuICAgICAgLndoZW4gJy9zaGVldC86bnVtYmVyJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3NoZWV0Q3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAnc2hlZXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdzaGVldC5odG1sJylcbiAgICAgIC53aGVuICcvZG9uZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdkb25lQ3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAnZG9uZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ2RvbmUuaHRtbCcpXG4gICAgICAud2hlbiAnL3BlcnNvbicsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdwZXJzb25DdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdwZXJzb24nXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdwZXJzb24uaHRtbCcpXG4gICAgICAud2hlbiAnL3Byb2JsZW0vOmlkJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3Byb2JsZW1DdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdwcm9ibGVtJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgncHJvYmxlbS5odG1sJylcbiAgICAgIC5vdGhlcndpc2VcbiAgICAgICAgcmVkaXJlY3RUbzogJy9zaGVldC9sYXRlc3QnXG5cbiAgLmNvbmZpZyAoJHJlc291cmNlUHJvdmlkZXIpIC0+XG4gICAgJHJlc291cmNlUHJvdmlkZXIuZGVmYXVsdHMuc3RyaXBUcmFpbGluZ1NsYXNoZXMgPSBmYWxzZVxuXG4gIC5jb25maWcgKCRsb2NhdGlvblByb3ZpZGVyKSAtPlxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSB0cnVlXG5cbiAgLmNvbmZpZyAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKSAtPlxuICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlXG5cbiAgLmNvbmZpZyAoJGh0dHBQcm92aWRlcikgLT5cbiAgICBjc3JmX3Rva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPWNzcmYtdG9rZW5dJykuY29udGVudFxuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQ1NSRlRva2VuJ10gPSBjc3JmX3Rva2VuXG4iLCJ1dGlscyA9IHJlcXVpcmUgJy4vdXRpbHMuY29mZmVlJ1xuXG5hcGlfcGF0aCA9IHV0aWxzLmFwaV9wYXRoXG5cbm1vZHVsZS5leHBvcnRzID0gKCRyZXNvdXJjZSkgLT5cbiAgJ1Byb2JsZW0nOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC8nKSwge2lkOiAnQGlkJ30sXG4gICAgICBzdGFycmVkOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvc3RhcnJlZC8nKVxuICAgICAgaGFzX3N0YXI6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9ibGVtcy86aWQvaGFzX3N0YXInKVxuICAgICAgICBwYXJhbXM6IHtpZDogJ0Bwcm9ibGVtSWQnfVxuICAgICAgc3RhcjpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC9zdGFyLycpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQGlkJ31cbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgIHVuc3RhcjpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC91bnN0YXIvJylcbiAgICAgICAgcGFyYW1zOiB7aWQ6ICdAaWQnfVxuICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuXG4gICdBc3NpZ25tZW50JzpcbiAgICAkcmVzb3VyY2UgYXBpX3BhdGgoJy9hc3NpZ25tZW50cy86aWQnKSwge2lkOiAnQGlkJ30sXG4gICAgICBzb2x2ZWQ6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9hc3NpZ25tZW50cy9zb2x2ZWQnKVxuICAgICAgZG9uZTpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL2Fzc2lnbm1lbnRzLzppZC9kb25lLycpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQGlkJ31cbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcblxuICAnU2hlZXQnOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3NoZWV0cy86bnVtYmVyJyksIHtudW1iZXI6ICdAbnVtYmVyJ31cblxuICAnQ29tbWVudCc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvY29tbWVudHMvJyksIHt9XG5cbiAgJ1Byb2ZpbGUnOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3Byb2ZpbGUvOmlkJyksIHtpZDogJ0BpZCd9LFxuICAgICAgbWU6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9maWxlL21lLycpXG4gICAgICB1cGRhdGU6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9maWxlLzppZCcpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQGlkJ31cbiAgICAgICAgbWV0aG9kOiAnUEFUQ0gnXG5cbiIsImNsYXNzIFBlcnNvbkN0cmxcbiAgc3RhckRhdGE6IG51bGxcbiAgbmV4dDogbnVsbFxuICBzdGFyQ291bnQ6IDBcbiAgc3RhcnJlZFByb2JsZW1zOiBbXVxuICBkZWFjdGl2YXRlX3BhdGg6IERFQUNUSVZBVEVfUEFUSFxuICBsb2dvdXRfcGF0aDogTE9HT1VUX1BBVEhcbiAgY2hhbmdlX3Bhc3NfcGF0aDogQ0hBTkdFX1BBU1NfUEFUSFxuXG4gIHByb2ZpbGVEYXRhOiBudWxsXG4gIGRpZmZpY3VsdHk6IDJcblxuICBwYXJzZU5leHQ6IChuZXh0KS0+XG4gICAgaWYgbmV4dFxuICAgICAgbWF0Y2ggPSBuZXh0Lm1hdGNoIC9wYWdlPShcXGQrKS9cbiAgICAgIGlmIG1hdGNoLmxlbmd0aCA9PSAyXG4gICAgICAgIEBuZXh0ID0gcGFyc2VJbnQobWF0Y2hbMV0pXG4gICAgICAgIHJldHVyblxuICAgIEBuZXh0ID0gbnVsbFxuICBcbiAgbG9hZF9tb3JlOiAtPlxuICAgIEAkbW9kZWxzLlByb2JsZW0uc3RhcnJlZCBwYWdlOiBAbmV4dCwgKGRhdGEpID0+XG4gICAgICBmb3IgcHJvYmxlbSBpbiBkYXRhLnJlc3VsdHNcbiAgICAgICAgQHBhcnNlTmV4dCBkYXRhLm5leHRcbiAgICAgICAgQHN0YXJyZWRQcm9ibGVtcy5wdXNoIHByb2JsZW1cblxuICBzYXZlX2RpZmZpY3VsdHk6IC0+XG4gICAgICBAcHJvZmlsZURhdGEuZGlmZmljdWx0eSA9IEBkaWZmaWN1bHR5XG4gICAgICBAcHJvZmlsZURhdGEuJHVwZGF0ZSgpXG5cbiAgcmVhZGFibGVfZGlmZmljdWx0eTogLT5cbiAgICAgIHN3aXRjaCBwYXJzZUludChAZGlmZmljdWx0eSlcbiAgICAgICAgICB3aGVuIDBcbiAgICAgICAgICAgICAgJ1ZlcnkgRWFzeSdcbiAgICAgICAgICB3aGVuIDFcbiAgICAgICAgICAgICAgJ0Vhc3knXG4gICAgICAgICAgd2hlbiAyXG4gICAgICAgICAgICAgICdNZWRpdW0nXG4gICAgICAgICAgd2hlbiAzXG4gICAgICAgICAgICAgICdIYXJkJ1xuICAgICAgICAgIHdoZW4gNFxuICAgICAgICAgICAgICAnVmVyeSBIYXJkJ1xuXG4gIGNvbnN0cnVjdG9yOiAoQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuUHJvYmxlbS5zdGFycmVkIChkYXRhKSA9PlxuICAgICAgQHBhcnNlTmV4dCBkYXRhLm5leHRcbiAgICAgIEBzdGFyQ291bnQgPSBkYXRhLmNvdW50XG4gICAgICBAc3RhcnJlZFByb2JsZW1zID0gZGF0YS5yZXN1bHRzXG4gICAgICBAc3RhckRhdGEgPSBkYXRhXG5cbiAgICBAJG1vZGVscy5Qcm9maWxlLm1lIChkYXRhKSA9PlxuICAgICAgQGRpZmZpY3VsdHkgPSBkYXRhLmRpZmZpY3VsdHlcbiAgICAgIEBwcm9maWxlRGF0YSA9IGRhdGFcblxubW9kdWxlLmV4cG9ydHMgPSBQZXJzb25DdHJsXG4iLCJjbGFzcyBQcm9ibGVtQ3RybFxuICBwcm9ibGVtRGF0YTogbnVsbFxuXG4gIGRhdGU6ICcnXG4gIHByb2JsZW1JZDogJydcbiAgcHJvYmxlbU5hbWU6ICcnXG4gIHByb2JsZW1TdGF0ZW1lbnQ6ICcnXG4gIG1hdGNoTmFtZTogJydcbiAgdGFnczogW11cbiAgaGFzX3N0YXI6IGZhbHNlXG4gIGNvbW1lbnRzOiBbXVxuICBuZXdDb21tZW50Q29udGVudDogJydcbiAgZGlzYWJsZUNvbW1lbnQ6IGZhbHNlXG5cbiAgZ2V0X2RhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRlID0gZGF0YS5kYXRlXG4gICAgQHByb2JsZW1JZCA9IGRhdGEucHJvYmxlbUlkXG4gICAgQHByb2JsZW1OYW1lID0gZGF0YS5wcm9ibGVtTmFtZVxuICAgIEBwcm9ibGVtU3RhdGVtZW50ID0gZGF0YS5wcm9ibGVtU3RhdGVtZW50XG4gICAgQG1hdGNoTmFtZSA9IGRhdGEubWF0Y2hOYW1lXG4gICAgQHRhZ3MgPSAodGFnLnRyaW0oKSBmb3IgdGFnIGluIGRhdGEudGFncy5zcGxpdCgnLCcpKVxuICAgIEBwcm9ibGVtRGF0YSA9IGRhdGFcbiAgICBAJG1vZGVscy5Qcm9ibGVtLmhhc19zdGFyIGlkOiBAcHJvYmxlbUlkLCAocmVzKSA9PiBAaGFzX3N0YXIgPSByZXMuaGFzX3N0YXJcblxuICBnZXRfY29tbWVudF9kYXRhOiAoZGF0YSkgLT5cbiAgICBAY29tbWVudHMgPSBkYXRhXG5cbiAgc3RhcjogLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLnN0YXIgaWQ6IEBwcm9ibGVtSWQsIChyZXMpID0+XG4gICAgICBAaGFzX3N0YXIgPSB0cnVlIGlmIHJlcy5zdGF0dXMgPT0gJ29rJ1xuXG4gIHVuc3RhcjogLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLnVuc3RhciBpZDogQHByb2JsZW1JZCwgKHJlcykgPT5cbiAgICAgIEBoYXNfc3RhciA9IGZhbHNlIGlmIHJlcy5zdGF0dXMgPT0gJ29rJ1xuXG4gIGNvbW1lbnRJbnZhbGlkOiAtPlxuICAgICAgcmV0dXJuIEBuZXdDb21tZW50Q29udGVudC50cmltKCkubGVuZ3RoID09IDBcblxuICBjb21tZW50OiAtPlxuICAgICAgcmV0dXJuIGlmIEBjb21tZW50SW52YWxpZCgpXG5cbiAgICAgIGNvbnRlbnQgPSBAbmV3Q29tbWVudENvbnRlbnQudHJpbSgpXG4gICAgICBAZGlzYWJsZUNvbW1lbnQgPSB0cnVlXG4gICAgICBuZXdDb21tZW50ID0gbmV3IEAkbW9kZWxzLkNvbW1lbnRcbiAgICAgICAgcHJvYmxlbTogQHByb2JsZW1JZFxuICAgICAgICBjb250ZW50OiBjb250ZW50XG4gICAgICBuZXdDb21tZW50LiRzYXZlIChkYXRhKSA9PlxuICAgICAgICAgIEBjb21tZW50cy51bnNoaWZ0IGRhdGFcbiAgICAgICAgICBAbmV3Q29tbWVudENvbnRlbnQgPSAnJ1xuICAgICAgICAgIEBkaXNhYmxlQ29tbWVudCA9IGZhbHNlXG5cbiAgY2xlYXJDb21tZW50OiAtPlxuICAgIEBuZXdDb21tZW50Q29udGVudCA9ICcnXG5cbiAgY29uc3RydWN0b3I6ICgkcm91dGVQYXJhbXMsIEAkbW9kZWxzKSAtPlxuICAgIEAkbW9kZWxzLlByb2JsZW0uZ2V0IGlkOiAkcm91dGVQYXJhbXMuaWQsIChkYXRhKSA9PiBAZ2V0X2RhdGEoZGF0YSlcbiAgICBAJG1vZGVscy5Db21tZW50LnF1ZXJ5IHByb2JsZW06ICRyb3V0ZVBhcmFtcy5pZCwgKGRhdGEpID0+IEBnZXRfY29tbWVudF9kYXRhKGRhdGEpXG5cbm1vZHVsZS5leHBvcnRzID0gUHJvYmxlbUN0cmxcbiIsInRlbXBsYXRlX3BhdGggPSByZXF1aXJlKCcuL3V0aWxzLmNvZmZlZScpLnRlbXBsYXRlX3BhdGhcblxuaW5pdFN3aXBlQWN0aW9uID0gKHNjb3BlLCBlbGVtZW50LCAkc3dpcGUpIC0+XG4gIHNjb3BlLmRvbmVfYWN0aW9uID0gc2NvcGUuYWN0aW9uXG4gIHN3aXBlRWxlbWVudCA9IGVsZW1lbnQuY2hpbGRyZW4oKVxuICBvcmlnaW5YID0gMFxuICBzd2lwZU9mZnNldCA9IDBcbiAgY2FuY2VsaW5nT2Zmc2V0ID0gZmFsc2VcblxuICBnZXRPZmZzZXQgPSAoeCkgLT5cbiAgICBvZmZzZXQgPSB4IC0gb3JpZ2luWFxuICAgIG9mZnNldCA9IDAgaWYgb2Zmc2V0ID4gMFxuICAgIHN3aXBlT2Zmc2V0ID0gMTAwIC0gMTAwICogTWF0aC5wb3coMS4yLCBvZmZzZXQvMTApXG5cbiAgdXBkYXRlT2Zmc2V0ID0gLT5cbiAgICBzd2lwZUVsZW1lbnQuYXR0ciAnc3R5bGUnLCBcIi13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoLSN7c3dpcGVPZmZzZXR9cHgsIDApO3RyYW5zZm9ybTogdHJhbnNsYXRlKC0je3N3aXBlT2Zmc2V0fXB4LCAwKVwiXG5cbiAgJHN3aXBlLmJpbmQgZWxlbWVudCxcbiAgICBzdGFydDogKG9iaikgLT5cbiAgICAgIGlmIG5vdCBzY29wZS5wcm9ibGVtLmRvbmVcbiAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnbm90LXRvdWNoaW5nJylcbiAgICAgICAgb3JpZ2luWCA9IG9iai54XG4gICAgbW92ZTogKG9iaikgLT5cbiAgICAgIGlmIG5vdCBzY29wZS5wcm9ibGVtLmRvbmVcbiAgICAgICAgZ2V0T2Zmc2V0KG9iai54KVxuICAgICAgICB1cGRhdGVPZmZzZXQob2JqLngpXG4gICAgZW5kOiAob2JqKSAtPlxuICAgICAgaWYgbm90IHNjb3BlLnByb2JsZW0uZG9uZVxuICAgICAgICBzY29wZS5hY3Rpb24oKSBpZiBzd2lwZU9mZnNldCA+IDgwXG4gICAgICBlbGVtZW50LmFkZENsYXNzKCdub3QtdG91Y2hpbmcnKVxuICAgICAgc3dpcGVPZmZzZXQgPSAwXG4gICAgICB1cGRhdGVPZmZzZXQoKVxuICAgIGNhbmNlbDogKG9iaikgLT5cbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ25vdC10b3VjaGluZycpXG4gICAgICBzd2lwZU9mZnNldCA9IDBcbiAgICAgIHVwZGF0ZU9mZnNldCgpXG5cbm1vZHVsZS5leHBvcnRzID0gKCRsb2NhdGlvbiwgJHN3aXBlKSAtPlxuICByZXN0cmljdDogJ0UnXG4gIHNjb3BlOlxuICAgIHR5cGU6ICc9J1xuICAgIHByb2JsZW06ICc9J1xuICAgIGFjdGlvbjogJyYnXG4gIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCcvcHJvYmxlbV9kaXJlY3RpdmUuaHRtbCcpXG5cbiAgbGluazogKHNjb3BlLCBlbGVtZW50KSAtPlxuICAgIHNjb3BlLmRldGFpbF9hY3Rpb249IC0+XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Byb2JsZW0vJyArIHNjb3BlLnByb2JsZW0ub3JpZ2luUHJvYmxlbSlcblxuICAgIGlmIHNjb3BlLnR5cGUgPT0gJ3N0YXInXG4gICAgICBzY29wZS5pc19zdGFyID0gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIHNjb3BlLmlzX2Fzc2lnbm1lbnQgPSB0cnVlXG5cbiAgICBpZiBzY29wZS5hY3Rpb24gYW5kIChub3Qgc2NvcGUucHJvYmxlbS5kb25lKSBhbmQgc2NvcGUuaXNfYXNzaWdubWVudFxuICAgICAgaW5pdFN3aXBlQWN0aW9uKHNjb3BlLCBlbGVtZW50LCAkc3dpcGUpXG4iLCJjbGFzcyBzaGVldEN0cmxcbiAgc2hlZXREYXRhOiBudWxsXG4gIGRhdGU6ICcnXG4gIG51bWJlcjogMFxuICBwcm9ibGVtczogJydcbiAgaGFzX292ZXJkdWU6IGZhbHNlXG4gIGhhc19uZXc6IGZhbHNlXG4gIGhhc19yZXZpZXc6IGZhbHNlXG4gIGlzX2xhc3Q6IHRydWVcbiAgbm9uZTogZmFsc2VcblxuICBnZXRfZGF0YTogKGRhdGEpIC0+XG4gICAgaWYgZGF0YS5ub25lXG4gICAgICBAbm9uZSA9IHRydWVcbiAgICAgIHJldHVyblxuICAgIEBpc19sYXN0ID0gZGF0YS5pc19sYXN0XG4gICAgQGRhdGUgPSBkYXRhLmRhdGVcbiAgICBAbnVtYmVyID0gZGF0YS5udW1iZXJcbiAgICBAcHJvYmxlbXMgPSBkYXRhLnByb2JsZW1zXG4gICAgQHRhZ3MgPSBbXVxuICAgIHRhZ01hcCA9IHt9XG4gICAgZm9yIHByb2JsZW0gaW4gQHByb2JsZW1zXG4gICAgICB0YWdzID0gcHJvYmxlbS50YWdzLnNwbGl0KCcsJylcbiAgICAgIGZvciB0YWcgaW4gdGFnc1xuICAgICAgICB0YWcgPSB0YWcudHJpbSgpXG4gICAgICAgIGlmIHRhZyAgYW5kICghdGFnTWFwW3RhZ10pXG4gICAgICAgICAgQHRhZ3MucHVzaCB0YWdcbiAgICAgICAgICB0YWdNYXBbdGFnXSA9IHRydWVcbiAgICAgIHN3aXRjaCBwcm9ibGVtLnR5cGVcbiAgICAgICAgd2hlbiAnb3ZlcmR1ZSdcbiAgICAgICAgICBAaGFzX292ZXJkdWUgPSB0cnVlXG4gICAgICAgIHdoZW4gJ25ldydcbiAgICAgICAgICBAaGFzX25ldyA9IHRydWVcbiAgICAgICAgd2hlbiAncmV2aWV3J1xuICAgICAgICAgIEBoYXNfcmV2aWV3ID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgQHNoZWV0RGF0YSA9IGRhdGFcblxuICBkb25lOiAocHJvYmxlbSkgLT5cbiAgICBAJG1vZGVscy5Bc3NpZ25tZW50LmRvbmUgaWQ6IHByb2JsZW0uaWQsIChkYXRhKSA9PlxuICAgICAgcHJvYmxlbS5kb25lID0gdHJ1ZVxuIFxuICBjb25zdHJ1Y3RvcjogKCRyb3V0ZVBhcmFtcywgQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuU2hlZXQuZ2V0IG51bWJlcjogJHJvdXRlUGFyYW1zLm51bWJlciwgKGRhdGEpID0+IEBnZXRfZGF0YShkYXRhKVxuICAgICAgXG5cbm1vZHVsZS5leHBvcnRzID0gc2hlZXRDdHJsXG4iLCJ0ZW1wbGF0ZV9wYXRoID0gKHBhdGgpIC0+XG4gIHBhdGggPz0gJydcbiAgcmV0dXJuIFRFTVBMQVRFX1BBVEhfQkFTRSArICcvJyArIHBhdGhcblxuYXBpX3BhdGggPSAocGF0aCkgLT5cbiAgcmV0dXJuIEFQSV9QQVRIX0JBU0UgKyBwYXRoXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYXBpX3BhdGg6IGFwaV9wYXRoXG4gIHRlbXBsYXRlX3BhdGg6IHRlbXBsYXRlX3BhdGhcbiJdfQ==
