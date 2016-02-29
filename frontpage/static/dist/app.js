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
    'Problem': $resource(api_path('/problems/:id'), {
      id: '@id'
    }, {
      starred: {
        url: api_path('/problems/starred')
      },
      has_star: {
        url: api_path('/problems/:id/has_star'),
        params: {
          id: '@problemId'
        }
      },
      star: {
        url: api_path('/problems/:id/star'),
        params: {
          id: '@id'
        },
        method: 'POST'
      },
      unstar: {
        url: api_path('/problems/:id/unstar'),
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
        url: api_path('/assignments/:id/done'),
        params: {
          id: '@id'
        },
        method: 'POST'
      }
    }),
    'Sheet': $resource(api_path('/sheets/:number'), {
      number: '@number'
    }),
    'Comment': $resource(api_path('/comments'), {}),
    'Profile': $resource(api_path('/profile/:id'), {
      id: '@id'
    }, {
      me: {
        url: api_path('/profile/me')
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2RvbmVDdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tb2RlbHMuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1DdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9zaGVldEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3V0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LE1BQUEsRUFBUSxZQUFZLENBQUMsTUFBckI7S0FBbkIsRUFBZ0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsSUFBRCxHQUFBO2VBQVUsS0FBQyxDQUFBLFFBQUQsQ0FBVSxJQUFWLEVBQVY7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxDQUFBLENBRFc7RUFBQSxDQXpDYjs7bUJBQUE7O0lBREYsQ0FBQTs7QUFBQSxNQThDTSxDQUFDLE9BQVAsR0FBaUIsU0E5Q2pCLENBQUE7Ozs7O0FDQUEsSUFBQSx1QkFBQTs7QUFBQSxhQUFBLEdBQWdCLFNBQUMsSUFBRCxHQUFBOztJQUNkLE9BQVE7R0FBUjtBQUNBLFNBQU8sa0JBQUEsR0FBcUIsR0FBckIsR0FBMkIsSUFBbEMsQ0FGYztBQUFBLENBQWhCLENBQUE7O0FBQUEsUUFJQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsU0FBTyxhQUFBLEdBQWdCLElBQXZCLENBRFM7QUFBQSxDQUpYLENBQUE7O0FBQUEsTUFPTSxDQUFDLE9BQVAsR0FDRTtBQUFBLEVBQUEsUUFBQSxFQUFVLFFBQVY7QUFBQSxFQUNBLGFBQUEsRUFBZSxhQURmO0NBUkYsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBBcHBDdHJsXG4gIGdvOiAocGF0aCkgLT5cbiAgICBAJGxvY2F0aW9uLnBhdGgocGF0aClcblxuICBjb25zdHJ1Y3RvcjogKEAkbG9jYXRpb24pIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEN0cmxcbiIsImNsYXNzIERvbmVDdHJsXG4gIGRvbmVEYXRhOiBudWxsXG4gIG5leHQ6IG51bGxcbiAgY291bnQ6IDBcbiAgcHJvYmxlbXM6IFtdXG5cbiAgcGFyc2VOZXh0OiAobmV4dCktPlxuICAgIGlmIG5leHRcbiAgICAgIG1hdGNoID0gbmV4dC5tYXRjaCAvcGFnZT0oXFxkKykvXG4gICAgICBpZiBtYXRjaC5sZW5ndGggPT0gMlxuICAgICAgICBAbmV4dCA9IHBhcnNlSW50KG1hdGNoWzFdKVxuICAgICAgICByZXR1cm5cbiAgICBAbmV4dCA9IG51bGxcbiAgXG4gIGxvYWRfbW9yZTogLT5cbiAgICBAJG1vZGVscy5Bc3NpZ25tZW50LnNvbHZlZCBwYWdlOiBAbmV4dCwgKGRhdGEpID0+XG4gICAgICBmb3IgcHJvYmxlbSBpbiBkYXRhLnJlc3VsdHNcbiAgICAgICAgQHBhcnNlTmV4dCBkYXRhLm5leHRcbiAgICAgICAgQHByb2JsZW1zLnB1c2ggcHJvYmxlbVxuXG4gIGNvbnN0cnVjdG9yOiAoQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuQXNzaWdubWVudC5zb2x2ZWQgKGRhdGEpID0+XG4gICAgICBAcGFyc2VOZXh0IGRhdGEubmV4dFxuICAgICAgQGNvdW50ID0gZGF0YS5jb3VudFxuICAgICAgQHByb2JsZW1zID0gZGF0YS5yZXN1bHRzXG4gICAgICBAZG9uZURhdGEgPSBkYXRhXG5cblxubW9kdWxlLmV4cG9ydHMgPSBEb25lQ3RybFxuIiwidXRpbHMgPSByZXF1aXJlICcuL3V0aWxzLmNvZmZlZSdcblxuYXBwQ3RybCA9IHJlcXVpcmUgJy4vYXBwQ3RybC5jb2ZmZWUnXG5zaGVldEN0cmwgPSByZXF1aXJlICcuL3NoZWV0Q3RybC5jb2ZmZWUnXG5kb25lQ3RybCA9IHJlcXVpcmUgJy4vZG9uZUN0cmwuY29mZmVlJ1xucGVyc29uQ3RybCA9IHJlcXVpcmUgJy4vcGVyc29uQ3RybC5jb2ZmZWUnXG5wcm9ibGVtQ3RybCA9IHJlcXVpcmUgJy4vcHJvYmxlbUN0cmwuY29mZmVlJ1xuXG5wcm9ibGVtRGlyZWN0aXZlID0gcmVxdWlyZSAnLi9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSdcblxubW9kZWxzID0gcmVxdWlyZSAnLi9tb2RlbHMuY29mZmVlJ1xuXG50ZW1wbGF0ZV9wYXRoID0gdXRpbHMudGVtcGxhdGVfcGF0aFxuXG5hbmd1bGFyLm1vZHVsZSgndGNoQXBwJywgW1xuICAnbmdSb3V0ZScsXG4gICduZ1RvdWNoJyxcbiAgJ25nQW5pbWF0ZScsXG4gICduZ1Nhbml0aXplJyxcbiAgJ25nUmVzb3VyY2UnLFxuICAnYW5ndWxhci1sb2FkaW5nLWJhcicsXG4gICdtb25vc3BhY2VkLmVsYXN0aWMnLFxuICAndWkuZ3JhdmF0YXInLFxuXSlcbiAgLmNvbnRyb2xsZXIgJ2FwcEN0cmwnLCBhcHBDdHJsXG4gIC5jb250cm9sbGVyICdzaGVldEN0cmwnLCBzaGVldEN0cmxcbiAgLmNvbnRyb2xsZXIgJ2RvbmVDdHJsJywgZG9uZUN0cmxcbiAgLmNvbnRyb2xsZXIgJ3BlcnNvbkN0cmwnLCBwZXJzb25DdHJsXG4gIC5jb250cm9sbGVyICdwcm9ibGVtQ3RybCcsIHByb2JsZW1DdHJsXG5cbiAgLmRpcmVjdGl2ZSAncHJvYmxlbScsIHByb2JsZW1EaXJlY3RpdmVcblxuICAuZmFjdG9yeSAnJG1vZGVscycsIG1vZGVsc1xuXG4gIC5jb25maWcgKCRyb3V0ZVByb3ZpZGVyKSAtPlxuICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAud2hlbiAnL3NoZWV0LzpudW1iZXInLFxuICAgICAgICBjb250cm9sbGVyOiAnc2hlZXRDdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdzaGVldCdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3NoZWV0Lmh0bWwnKVxuICAgICAgLndoZW4gJy9kb25lJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2RvbmVDdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdkb25lJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgnZG9uZS5odG1sJylcbiAgICAgIC53aGVuICcvcGVyc29uJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3BlcnNvbkN0cmwnXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3BlcnNvbidcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3BlcnNvbi5odG1sJylcbiAgICAgIC53aGVuICcvcHJvYmxlbS86aWQnLFxuICAgICAgICBjb250cm9sbGVyOiAncHJvYmxlbUN0cmwnXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3Byb2JsZW0nXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdwcm9ibGVtLmh0bWwnKVxuICAgICAgLm90aGVyd2lzZVxuICAgICAgICByZWRpcmVjdFRvOiAnL3NoZWV0L2xhdGVzdCdcblxuICAuY29uZmlnICgkcmVzb3VyY2VQcm92aWRlcikgLT5cbiAgICAkcmVzb3VyY2VQcm92aWRlci5kZWZhdWx0cy5zdHJpcFRyYWlsaW5nU2xhc2hlcyA9IGZhbHNlXG5cbiAgLmNvbmZpZyAoJGxvY2F0aW9uUHJvdmlkZXIpIC0+XG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlIHRydWVcblxuICAuY29uZmlnIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpIC0+XG4gICAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVTcGlubmVyID0gZmFsc2VcblxuICAuY29uZmlnICgkaHR0cFByb3ZpZGVyKSAtPlxuICAgIGNzcmZfdG9rZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9Y3NyZi10b2tlbl0nKS5jb250ZW50XG4gICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1DU1JGVG9rZW4nXSA9IGNzcmZfdG9rZW5cbiIsInV0aWxzID0gcmVxdWlyZSAnLi91dGlscy5jb2ZmZWUnXG5cbmFwaV9wYXRoID0gdXRpbHMuYXBpX3BhdGhcblxubW9kdWxlLmV4cG9ydHMgPSAoJHJlc291cmNlKSAtPlxuICAnUHJvYmxlbSc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkJyksIHtpZDogJ0BpZCd9LFxuICAgICAgc3RhcnJlZDpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zL3N0YXJyZWQnKVxuICAgICAgaGFzX3N0YXI6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9ibGVtcy86aWQvaGFzX3N0YXInKVxuICAgICAgICBwYXJhbXM6IHtpZDogJ0Bwcm9ibGVtSWQnfVxuICAgICAgc3RhcjpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC9zdGFyJylcbiAgICAgICAgcGFyYW1zOiB7aWQ6ICdAaWQnfVxuICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgdW5zdGFyOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkL3Vuc3RhcicpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQGlkJ31cbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcblxuICAnQXNzaWdubWVudCc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvYXNzaWdubWVudHMvOmlkJyksIHtpZDogJ0BpZCd9LFxuICAgICAgc29sdmVkOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvYXNzaWdubWVudHMvc29sdmVkJylcbiAgICAgIGRvbmU6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9hc3NpZ25tZW50cy86aWQvZG9uZScpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQGlkJ31cbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcblxuICAnU2hlZXQnOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3NoZWV0cy86bnVtYmVyJyksIHtudW1iZXI6ICdAbnVtYmVyJ31cblxuICAnQ29tbWVudCc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvY29tbWVudHMnKSwge31cblxuICAnUHJvZmlsZSc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvcHJvZmlsZS86aWQnKSwge2lkOiAnQGlkJ30sXG4gICAgICBtZTpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2ZpbGUvbWUnKVxuICAgICAgdXBkYXRlOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvZmlsZS86aWQnKVxuICAgICAgICBwYXJhbXM6IHtpZDogJ0BpZCd9XG4gICAgICAgIG1ldGhvZDogJ1BBVENIJ1xuXG4iLCJjbGFzcyBQZXJzb25DdHJsXG4gIHN0YXJEYXRhOiBudWxsXG4gIG5leHQ6IG51bGxcbiAgc3RhckNvdW50OiAwXG4gIHN0YXJyZWRQcm9ibGVtczogW11cbiAgZGVhY3RpdmF0ZV9wYXRoOiBERUFDVElWQVRFX1BBVEhcbiAgbG9nb3V0X3BhdGg6IExPR09VVF9QQVRIXG4gIGNoYW5nZV9wYXNzX3BhdGg6IENIQU5HRV9QQVNTX1BBVEhcblxuICBwcm9maWxlRGF0YTogbnVsbFxuICBkaWZmaWN1bHR5OiAyXG5cbiAgcGFyc2VOZXh0OiAobmV4dCktPlxuICAgIGlmIG5leHRcbiAgICAgIG1hdGNoID0gbmV4dC5tYXRjaCAvcGFnZT0oXFxkKykvXG4gICAgICBpZiBtYXRjaC5sZW5ndGggPT0gMlxuICAgICAgICBAbmV4dCA9IHBhcnNlSW50KG1hdGNoWzFdKVxuICAgICAgICByZXR1cm5cbiAgICBAbmV4dCA9IG51bGxcbiAgXG4gIGxvYWRfbW9yZTogLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLnN0YXJyZWQgcGFnZTogQG5leHQsIChkYXRhKSA9PlxuICAgICAgZm9yIHByb2JsZW0gaW4gZGF0YS5yZXN1bHRzXG4gICAgICAgIEBwYXJzZU5leHQgZGF0YS5uZXh0XG4gICAgICAgIEBzdGFycmVkUHJvYmxlbXMucHVzaCBwcm9ibGVtXG5cbiAgc2F2ZV9kaWZmaWN1bHR5OiAtPlxuICAgICAgQHByb2ZpbGVEYXRhLmRpZmZpY3VsdHkgPSBAZGlmZmljdWx0eVxuICAgICAgQHByb2ZpbGVEYXRhLiR1cGRhdGUoKVxuXG4gIHJlYWRhYmxlX2RpZmZpY3VsdHk6IC0+XG4gICAgICBzd2l0Y2ggcGFyc2VJbnQoQGRpZmZpY3VsdHkpXG4gICAgICAgICAgd2hlbiAwXG4gICAgICAgICAgICAgICdWZXJ5IEVhc3knXG4gICAgICAgICAgd2hlbiAxXG4gICAgICAgICAgICAgICdFYXN5J1xuICAgICAgICAgIHdoZW4gMlxuICAgICAgICAgICAgICAnTWVkaXVtJ1xuICAgICAgICAgIHdoZW4gM1xuICAgICAgICAgICAgICAnSGFyZCdcbiAgICAgICAgICB3aGVuIDRcbiAgICAgICAgICAgICAgJ1ZlcnkgSGFyZCdcblxuICBjb25zdHJ1Y3RvcjogKEAkbW9kZWxzKSAtPlxuICAgIEAkbW9kZWxzLlByb2JsZW0uc3RhcnJlZCAoZGF0YSkgPT5cbiAgICAgIEBwYXJzZU5leHQgZGF0YS5uZXh0XG4gICAgICBAc3RhckNvdW50ID0gZGF0YS5jb3VudFxuICAgICAgQHN0YXJyZWRQcm9ibGVtcyA9IGRhdGEucmVzdWx0c1xuICAgICAgQHN0YXJEYXRhID0gZGF0YVxuXG4gICAgQCRtb2RlbHMuUHJvZmlsZS5tZSAoZGF0YSkgPT5cbiAgICAgIEBkaWZmaWN1bHR5ID0gZGF0YS5kaWZmaWN1bHR5XG4gICAgICBAcHJvZmlsZURhdGEgPSBkYXRhXG5cbm1vZHVsZS5leHBvcnRzID0gUGVyc29uQ3RybFxuIiwiY2xhc3MgUHJvYmxlbUN0cmxcbiAgcHJvYmxlbURhdGE6IG51bGxcblxuICBkYXRlOiAnJ1xuICBwcm9ibGVtSWQ6ICcnXG4gIHByb2JsZW1OYW1lOiAnJ1xuICBwcm9ibGVtU3RhdGVtZW50OiAnJ1xuICBtYXRjaE5hbWU6ICcnXG4gIHRhZ3M6IFtdXG4gIGhhc19zdGFyOiBmYWxzZVxuICBjb21tZW50czogW11cbiAgbmV3Q29tbWVudENvbnRlbnQ6ICcnXG4gIGRpc2FibGVDb21tZW50OiBmYWxzZVxuXG4gIGdldF9kYXRhOiAoZGF0YSkgLT5cbiAgICBAZGF0ZSA9IGRhdGEuZGF0ZVxuICAgIEBwcm9ibGVtSWQgPSBkYXRhLnByb2JsZW1JZFxuICAgIEBwcm9ibGVtTmFtZSA9IGRhdGEucHJvYmxlbU5hbWVcbiAgICBAcHJvYmxlbVN0YXRlbWVudCA9IGRhdGEucHJvYmxlbVN0YXRlbWVudFxuICAgIEBtYXRjaE5hbWUgPSBkYXRhLm1hdGNoTmFtZVxuICAgIEB0YWdzID0gKHRhZy50cmltKCkgZm9yIHRhZyBpbiBkYXRhLnRhZ3Muc3BsaXQoJywnKSlcbiAgICBAcHJvYmxlbURhdGEgPSBkYXRhXG4gICAgQCRtb2RlbHMuUHJvYmxlbS5oYXNfc3RhciBpZDogQHByb2JsZW1JZCwgKHJlcykgPT4gQGhhc19zdGFyID0gcmVzLmhhc19zdGFyXG5cbiAgZ2V0X2NvbW1lbnRfZGF0YTogKGRhdGEpIC0+XG4gICAgQGNvbW1lbnRzID0gZGF0YVxuXG4gIHN0YXI6IC0+XG4gICAgQCRtb2RlbHMuUHJvYmxlbS5zdGFyIGlkOiBAcHJvYmxlbUlkLCAocmVzKSA9PlxuICAgICAgQGhhc19zdGFyID0gdHJ1ZSBpZiByZXMuc3RhdHVzID09ICdvaydcblxuICB1bnN0YXI6IC0+XG4gICAgQCRtb2RlbHMuUHJvYmxlbS51bnN0YXIgaWQ6IEBwcm9ibGVtSWQsIChyZXMpID0+XG4gICAgICBAaGFzX3N0YXIgPSBmYWxzZSBpZiByZXMuc3RhdHVzID09ICdvaydcblxuICBjb21tZW50SW52YWxpZDogLT5cbiAgICAgIHJldHVybiBAbmV3Q29tbWVudENvbnRlbnQudHJpbSgpLmxlbmd0aCA9PSAwXG5cbiAgY29tbWVudDogLT5cbiAgICAgIHJldHVybiBpZiBAY29tbWVudEludmFsaWQoKVxuXG4gICAgICBjb250ZW50ID0gQG5ld0NvbW1lbnRDb250ZW50LnRyaW0oKVxuICAgICAgQGRpc2FibGVDb21tZW50ID0gdHJ1ZVxuICAgICAgbmV3Q29tbWVudCA9IG5ldyBAJG1vZGVscy5Db21tZW50XG4gICAgICAgIHByb2JsZW06IEBwcm9ibGVtSWRcbiAgICAgICAgY29udGVudDogY29udGVudFxuICAgICAgbmV3Q29tbWVudC4kc2F2ZSAoZGF0YSkgPT5cbiAgICAgICAgICBAY29tbWVudHMudW5zaGlmdCBkYXRhXG4gICAgICAgICAgQG5ld0NvbW1lbnRDb250ZW50ID0gJydcbiAgICAgICAgICBAZGlzYWJsZUNvbW1lbnQgPSBmYWxzZVxuXG4gIGNsZWFyQ29tbWVudDogLT5cbiAgICBAbmV3Q29tbWVudENvbnRlbnQgPSAnJ1xuXG4gIGNvbnN0cnVjdG9yOiAoJHJvdXRlUGFyYW1zLCBAJG1vZGVscykgLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLmdldCBpZDogJHJvdXRlUGFyYW1zLmlkLCAoZGF0YSkgPT4gQGdldF9kYXRhKGRhdGEpXG4gICAgQCRtb2RlbHMuQ29tbWVudC5xdWVyeSBwcm9ibGVtOiAkcm91dGVQYXJhbXMuaWQsIChkYXRhKSA9PiBAZ2V0X2NvbW1lbnRfZGF0YShkYXRhKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2JsZW1DdHJsXG4iLCJ0ZW1wbGF0ZV9wYXRoID0gcmVxdWlyZSgnLi91dGlscy5jb2ZmZWUnKS50ZW1wbGF0ZV9wYXRoXG5cbmluaXRTd2lwZUFjdGlvbiA9IChzY29wZSwgZWxlbWVudCwgJHN3aXBlKSAtPlxuICBzY29wZS5kb25lX2FjdGlvbiA9IHNjb3BlLmFjdGlvblxuICBzd2lwZUVsZW1lbnQgPSBlbGVtZW50LmNoaWxkcmVuKClcbiAgb3JpZ2luWCA9IDBcbiAgc3dpcGVPZmZzZXQgPSAwXG4gIGNhbmNlbGluZ09mZnNldCA9IGZhbHNlXG5cbiAgZ2V0T2Zmc2V0ID0gKHgpIC0+XG4gICAgb2Zmc2V0ID0geCAtIG9yaWdpblhcbiAgICBvZmZzZXQgPSAwIGlmIG9mZnNldCA+IDBcbiAgICBzd2lwZU9mZnNldCA9IDEwMCAtIDEwMCAqIE1hdGgucG93KDEuMiwgb2Zmc2V0LzEwKVxuXG4gIHVwZGF0ZU9mZnNldCA9IC0+XG4gICAgc3dpcGVFbGVtZW50LmF0dHIgJ3N0eWxlJywgXCItd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlKC0je3N3aXBlT2Zmc2V0fXB4LCAwKTt0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtI3tzd2lwZU9mZnNldH1weCwgMClcIlxuXG4gICRzd2lwZS5iaW5kIGVsZW1lbnQsXG4gICAgc3RhcnQ6IChvYmopIC0+XG4gICAgICBpZiBub3Qgc2NvcGUucHJvYmxlbS5kb25lXG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ25vdC10b3VjaGluZycpXG4gICAgICAgIG9yaWdpblggPSBvYmoueFxuICAgIG1vdmU6IChvYmopIC0+XG4gICAgICBpZiBub3Qgc2NvcGUucHJvYmxlbS5kb25lXG4gICAgICAgIGdldE9mZnNldChvYmoueClcbiAgICAgICAgdXBkYXRlT2Zmc2V0KG9iai54KVxuICAgIGVuZDogKG9iaikgLT5cbiAgICAgIGlmIG5vdCBzY29wZS5wcm9ibGVtLmRvbmVcbiAgICAgICAgc2NvcGUuYWN0aW9uKCkgaWYgc3dpcGVPZmZzZXQgPiA4MFxuICAgICAgZWxlbWVudC5hZGRDbGFzcygnbm90LXRvdWNoaW5nJylcbiAgICAgIHN3aXBlT2Zmc2V0ID0gMFxuICAgICAgdXBkYXRlT2Zmc2V0KClcbiAgICBjYW5jZWw6IChvYmopIC0+XG4gICAgICBlbGVtZW50LmFkZENsYXNzKCdub3QtdG91Y2hpbmcnKVxuICAgICAgc3dpcGVPZmZzZXQgPSAwXG4gICAgICB1cGRhdGVPZmZzZXQoKVxuXG5tb2R1bGUuZXhwb3J0cyA9ICgkbG9jYXRpb24sICRzd2lwZSkgLT5cbiAgcmVzdHJpY3Q6ICdFJ1xuICBzY29wZTpcbiAgICB0eXBlOiAnPSdcbiAgICBwcm9ibGVtOiAnPSdcbiAgICBhY3Rpb246ICcmJ1xuICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgnL3Byb2JsZW1fZGlyZWN0aXZlLmh0bWwnKVxuXG4gIGxpbms6IChzY29wZSwgZWxlbWVudCkgLT5cbiAgICBzY29wZS5kZXRhaWxfYWN0aW9uPSAtPlxuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wcm9ibGVtLycgKyBzY29wZS5wcm9ibGVtLm9yaWdpblByb2JsZW0pXG5cbiAgICBpZiBzY29wZS50eXBlID09ICdzdGFyJ1xuICAgICAgc2NvcGUuaXNfc3RhciA9IHRydWVcbiAgICBlbHNlXG4gICAgICBzY29wZS5pc19hc3NpZ25tZW50ID0gdHJ1ZVxuXG4gICAgaWYgc2NvcGUuYWN0aW9uIGFuZCAobm90IHNjb3BlLnByb2JsZW0uZG9uZSkgYW5kIHNjb3BlLmlzX2Fzc2lnbm1lbnRcbiAgICAgIGluaXRTd2lwZUFjdGlvbihzY29wZSwgZWxlbWVudCwgJHN3aXBlKVxuIiwiY2xhc3Mgc2hlZXRDdHJsXG4gIHNoZWV0RGF0YTogbnVsbFxuICBkYXRlOiAnJ1xuICBudW1iZXI6IDBcbiAgcHJvYmxlbXM6ICcnXG4gIGhhc19vdmVyZHVlOiBmYWxzZVxuICBoYXNfbmV3OiBmYWxzZVxuICBoYXNfcmV2aWV3OiBmYWxzZVxuICBpc19sYXN0OiB0cnVlXG4gIG5vbmU6IGZhbHNlXG5cbiAgZ2V0X2RhdGE6IChkYXRhKSAtPlxuICAgIGlmIGRhdGEubm9uZVxuICAgICAgQG5vbmUgPSB0cnVlXG4gICAgICByZXR1cm5cbiAgICBAaXNfbGFzdCA9IGRhdGEuaXNfbGFzdFxuICAgIEBkYXRlID0gZGF0YS5kYXRlXG4gICAgQG51bWJlciA9IGRhdGEubnVtYmVyXG4gICAgQHByb2JsZW1zID0gZGF0YS5wcm9ibGVtc1xuICAgIEB0YWdzID0gW11cbiAgICB0YWdNYXAgPSB7fVxuICAgIGZvciBwcm9ibGVtIGluIEBwcm9ibGVtc1xuICAgICAgdGFncyA9IHByb2JsZW0udGFncy5zcGxpdCgnLCcpXG4gICAgICBmb3IgdGFnIGluIHRhZ3NcbiAgICAgICAgdGFnID0gdGFnLnRyaW0oKVxuICAgICAgICBpZiB0YWcgIGFuZCAoIXRhZ01hcFt0YWddKVxuICAgICAgICAgIEB0YWdzLnB1c2ggdGFnXG4gICAgICAgICAgdGFnTWFwW3RhZ10gPSB0cnVlXG4gICAgICBzd2l0Y2ggcHJvYmxlbS50eXBlXG4gICAgICAgIHdoZW4gJ292ZXJkdWUnXG4gICAgICAgICAgQGhhc19vdmVyZHVlID0gdHJ1ZVxuICAgICAgICB3aGVuICduZXcnXG4gICAgICAgICAgQGhhc19uZXcgPSB0cnVlXG4gICAgICAgIHdoZW4gJ3JldmlldydcbiAgICAgICAgICBAaGFzX3JldmlldyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgIEBzaGVldERhdGEgPSBkYXRhXG5cbiAgZG9uZTogKHByb2JsZW0pIC0+XG4gICAgQCRtb2RlbHMuQXNzaWdubWVudC5kb25lIGlkOiBwcm9ibGVtLmlkLCAoZGF0YSkgPT5cbiAgICAgIHByb2JsZW0uZG9uZSA9IHRydWVcbiBcbiAgY29uc3RydWN0b3I6ICgkcm91dGVQYXJhbXMsIEAkbW9kZWxzKSAtPlxuICAgIEAkbW9kZWxzLlNoZWV0LmdldCBudW1iZXI6ICRyb3V0ZVBhcmFtcy5udW1iZXIsIChkYXRhKSA9PiBAZ2V0X2RhdGEoZGF0YSlcbiAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9IHNoZWV0Q3RybFxuIiwidGVtcGxhdGVfcGF0aCA9IChwYXRoKSAtPlxuICBwYXRoID89ICcnXG4gIHJldHVybiBURU1QTEFURV9QQVRIX0JBU0UgKyAnLycgKyBwYXRoXG5cbmFwaV9wYXRoID0gKHBhdGgpIC0+XG4gIHJldHVybiBBUElfUEFUSF9CQVNFICsgcGF0aFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFwaV9wYXRoOiBhcGlfcGF0aFxuICB0ZW1wbGF0ZV9wYXRoOiB0ZW1wbGF0ZV9wYXRoXG4iXX0=
