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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2RvbmVDdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tb2RlbHMuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1DdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9zaGVldEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3V0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RCxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxJQUFELEdBQUE7ZUFBVSxLQUFDLENBQUEsUUFBRCxDQUFVLElBQVYsRUFBVjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhELENBQUEsQ0FEVztFQUFBLENBekNiOzttQkFBQTs7SUFERixDQUFBOztBQUFBLE1BOENNLENBQUMsT0FBUCxHQUFpQixTQTlDakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLHVCQUFBOztBQUFBLGFBQUEsR0FBZ0IsU0FBQyxJQUFELEdBQUE7O0lBQ2QsT0FBUTtHQUFSO0FBQ0EsU0FBTyxrQkFBQSxHQUFxQixHQUFyQixHQUEyQixJQUFsQyxDQUZjO0FBQUEsQ0FBaEIsQ0FBQTs7QUFBQSxRQUlBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxTQUFPLGFBQUEsR0FBZ0IsSUFBdkIsQ0FEUztBQUFBLENBSlgsQ0FBQTs7QUFBQSxNQU9NLENBQUMsT0FBUCxHQUNFO0FBQUEsRUFBQSxRQUFBLEVBQVUsUUFBVjtBQUFBLEVBQ0EsYUFBQSxFQUFlLGFBRGY7Q0FSRixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIEFwcEN0cmxcbiAgZ286IChwYXRoKSAtPlxuICAgIEAkbG9jYXRpb24ucGF0aChwYXRoKVxuXG4gIGNvbnN0cnVjdG9yOiAoQCRsb2NhdGlvbikgLT5cbiAgICBAdGl0bGUgPSAnVENIZWxwZXIgfCBhcHAnXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwQ3RybFxuIiwiY2xhc3MgRG9uZUN0cmxcbiAgZG9uZURhdGE6IG51bGxcbiAgbmV4dDogbnVsbFxuICBjb3VudDogMFxuICBwcm9ibGVtczogW11cblxuICBwYXJzZU5leHQ6IChuZXh0KS0+XG4gICAgaWYgbmV4dFxuICAgICAgbWF0Y2ggPSBuZXh0Lm1hdGNoIC9wYWdlPShcXGQrKS9cbiAgICAgIGlmIG1hdGNoLmxlbmd0aCA9PSAyXG4gICAgICAgIEBuZXh0ID0gcGFyc2VJbnQobWF0Y2hbMV0pXG4gICAgICAgIHJldHVyblxuICAgIEBuZXh0ID0gbnVsbFxuICBcbiAgbG9hZF9tb3JlOiAtPlxuICAgIEAkbW9kZWxzLkFzc2lnbm1lbnQuc29sdmVkIHBhZ2U6IEBuZXh0LCAoZGF0YSkgPT5cbiAgICAgIGZvciBwcm9ibGVtIGluIGRhdGEucmVzdWx0c1xuICAgICAgICBAcGFyc2VOZXh0IGRhdGEubmV4dFxuICAgICAgICBAcHJvYmxlbXMucHVzaCBwcm9ibGVtXG5cbiAgY29uc3RydWN0b3I6IChAJG1vZGVscykgLT5cbiAgICBAJG1vZGVscy5Bc3NpZ25tZW50LnNvbHZlZCAoZGF0YSkgPT5cbiAgICAgIEBwYXJzZU5leHQgZGF0YS5uZXh0XG4gICAgICBAY291bnQgPSBkYXRhLmNvdW50XG4gICAgICBAcHJvYmxlbXMgPSBkYXRhLnJlc3VsdHNcbiAgICAgIEBkb25lRGF0YSA9IGRhdGFcblxuXG5tb2R1bGUuZXhwb3J0cyA9IERvbmVDdHJsXG4iLCJ1dGlscyA9IHJlcXVpcmUgJy4vdXRpbHMuY29mZmVlJ1xuXG5hcHBDdHJsID0gcmVxdWlyZSAnLi9hcHBDdHJsLmNvZmZlZSdcbnNoZWV0Q3RybCA9IHJlcXVpcmUgJy4vc2hlZXRDdHJsLmNvZmZlZSdcbmRvbmVDdHJsID0gcmVxdWlyZSAnLi9kb25lQ3RybC5jb2ZmZWUnXG5wZXJzb25DdHJsID0gcmVxdWlyZSAnLi9wZXJzb25DdHJsLmNvZmZlZSdcbnByb2JsZW1DdHJsID0gcmVxdWlyZSAnLi9wcm9ibGVtQ3RybC5jb2ZmZWUnXG5cbnByb2JsZW1EaXJlY3RpdmUgPSByZXF1aXJlICcuL3Byb2JsZW1EaXJlY3RpdmUuY29mZmVlJ1xuXG5tb2RlbHMgPSByZXF1aXJlICcuL21vZGVscy5jb2ZmZWUnXG5cbnRlbXBsYXRlX3BhdGggPSB1dGlscy50ZW1wbGF0ZV9wYXRoXG5cbmFuZ3VsYXIubW9kdWxlKCd0Y2hBcHAnLCBbXG4gICduZ1JvdXRlJyxcbiAgJ25nVG91Y2gnLFxuICAnbmdBbmltYXRlJyxcbiAgJ25nU2FuaXRpemUnLFxuICAnbmdSZXNvdXJjZScsXG4gICdhbmd1bGFyLWxvYWRpbmctYmFyJyxcbiAgJ21vbm9zcGFjZWQuZWxhc3RpYycsXG4gICd1aS5ncmF2YXRhcicsXG5dKVxuICAuY29udHJvbGxlciAnYXBwQ3RybCcsIGFwcEN0cmxcbiAgLmNvbnRyb2xsZXIgJ3NoZWV0Q3RybCcsIHNoZWV0Q3RybFxuICAuY29udHJvbGxlciAnZG9uZUN0cmwnLCBkb25lQ3RybFxuICAuY29udHJvbGxlciAncGVyc29uQ3RybCcsIHBlcnNvbkN0cmxcbiAgLmNvbnRyb2xsZXIgJ3Byb2JsZW1DdHJsJywgcHJvYmxlbUN0cmxcblxuICAuZGlyZWN0aXZlICdwcm9ibGVtJywgcHJvYmxlbURpcmVjdGl2ZVxuXG4gIC5mYWN0b3J5ICckbW9kZWxzJywgbW9kZWxzXG5cbiAgLmNvbmZpZyAoJHJvdXRlUHJvdmlkZXIpIC0+XG4gICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgIC53aGVuICcvc2hlZXQvOm51bWJlcicsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdzaGVldEN0cmwnXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3NoZWV0J1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgnc2hlZXQuaHRtbCcpXG4gICAgICAud2hlbiAnL2RvbmUnLFxuICAgICAgICBjb250cm9sbGVyOiAnZG9uZUN0cmwnXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ2RvbmUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdkb25lLmh0bWwnKVxuICAgICAgLndoZW4gJy9wZXJzb24nLFxuICAgICAgICBjb250cm9sbGVyOiAncGVyc29uQ3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAncGVyc29uJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgncGVyc29uLmh0bWwnKVxuICAgICAgLndoZW4gJy9wcm9ibGVtLzppZCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdwcm9ibGVtQ3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAncHJvYmxlbSdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3Byb2JsZW0uaHRtbCcpXG4gICAgICAub3RoZXJ3aXNlXG4gICAgICAgIHJlZGlyZWN0VG86ICcvc2hlZXQvbGF0ZXN0J1xuXG4gIC5jb25maWcgKCRyZXNvdXJjZVByb3ZpZGVyKSAtPlxuICAgICRyZXNvdXJjZVByb3ZpZGVyLmRlZmF1bHRzLnN0cmlwVHJhaWxpbmdTbGFzaGVzID0gZmFsc2VcblxuICAuY29uZmlnICgkbG9jYXRpb25Qcm92aWRlcikgLT5cbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUgdHJ1ZVxuXG4gIC5jb25maWcgKGNmcExvYWRpbmdCYXJQcm92aWRlcikgLT5cbiAgICBjZnBMb2FkaW5nQmFyUHJvdmlkZXIuaW5jbHVkZVNwaW5uZXIgPSBmYWxzZVxuXG4gIC5jb25maWcgKCRodHRwUHJvdmlkZXIpIC0+XG4gICAgY3NyZl90b2tlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1jc3JmLXRva2VuXScpLmNvbnRlbnRcbiAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLUNTUkZUb2tlbiddID0gY3NyZl90b2tlblxuIiwidXRpbHMgPSByZXF1aXJlICcuL3V0aWxzLmNvZmZlZSdcblxuYXBpX3BhdGggPSB1dGlscy5hcGlfcGF0aFxuXG5tb2R1bGUuZXhwb3J0cyA9ICgkcmVzb3VyY2UpIC0+XG4gICdQcm9ibGVtJzpcbiAgICAkcmVzb3VyY2UgYXBpX3BhdGgoJy9wcm9ibGVtcy86aWQvJyksIHtpZDogJ0BpZCd9LFxuICAgICAgc3RhcnJlZDpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zL3N0YXJyZWQvJylcbiAgICAgIGhhc19zdGFyOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkL2hhc19zdGFyJylcbiAgICAgICAgcGFyYW1zOiB7aWQ6ICdAcHJvYmxlbUlkJ31cbiAgICAgIHN0YXI6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9ibGVtcy86aWQvc3Rhci8nKVxuICAgICAgICBwYXJhbXM6IHtpZDogJ0BpZCd9XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXG4gICAgICB1bnN0YXI6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9ibGVtcy86aWQvdW5zdGFyLycpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQGlkJ31cbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcblxuICAnQXNzaWdubWVudCc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvYXNzaWdubWVudHMvOmlkJyksIHtpZDogJ0BpZCd9LFxuICAgICAgc29sdmVkOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvYXNzaWdubWVudHMvc29sdmVkJylcbiAgICAgIGRvbmU6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9hc3NpZ25tZW50cy86aWQvZG9uZS8nKVxuICAgICAgICBwYXJhbXM6IHtpZDogJ0BpZCd9XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXG5cbiAgJ1NoZWV0JzpcbiAgICAkcmVzb3VyY2UgYXBpX3BhdGgoJy9zaGVldHMvOm51bWJlcicpLCB7bnVtYmVyOiAnQG51bWJlcid9XG5cbiAgJ0NvbW1lbnQnOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL2NvbW1lbnRzLycpLCB7fVxuXG4gICdQcm9maWxlJzpcbiAgICAkcmVzb3VyY2UgYXBpX3BhdGgoJy9wcm9maWxlLzppZCcpLCB7aWQ6ICdAaWQnfSxcbiAgICAgIG1lOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvZmlsZS9tZS8nKVxuICAgICAgdXBkYXRlOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvZmlsZS86aWQnKVxuICAgICAgICBwYXJhbXM6IHtpZDogJ0BpZCd9XG4gICAgICAgIG1ldGhvZDogJ1BBVENIJ1xuXG4iLCJjbGFzcyBQZXJzb25DdHJsXG4gIHN0YXJEYXRhOiBudWxsXG4gIG5leHQ6IG51bGxcbiAgc3RhckNvdW50OiAwXG4gIHN0YXJyZWRQcm9ibGVtczogW11cbiAgZGVhY3RpdmF0ZV9wYXRoOiBERUFDVElWQVRFX1BBVEhcbiAgbG9nb3V0X3BhdGg6IExPR09VVF9QQVRIXG4gIGNoYW5nZV9wYXNzX3BhdGg6IENIQU5HRV9QQVNTX1BBVEhcblxuICBwcm9maWxlRGF0YTogbnVsbFxuICBkaWZmaWN1bHR5OiAyXG5cbiAgcGFyc2VOZXh0OiAobmV4dCktPlxuICAgIGlmIG5leHRcbiAgICAgIG1hdGNoID0gbmV4dC5tYXRjaCAvcGFnZT0oXFxkKykvXG4gICAgICBpZiBtYXRjaC5sZW5ndGggPT0gMlxuICAgICAgICBAbmV4dCA9IHBhcnNlSW50KG1hdGNoWzFdKVxuICAgICAgICByZXR1cm5cbiAgICBAbmV4dCA9IG51bGxcbiAgXG4gIGxvYWRfbW9yZTogLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLnN0YXJyZWQgcGFnZTogQG5leHQsIChkYXRhKSA9PlxuICAgICAgZm9yIHByb2JsZW0gaW4gZGF0YS5yZXN1bHRzXG4gICAgICAgIEBwYXJzZU5leHQgZGF0YS5uZXh0XG4gICAgICAgIEBzdGFycmVkUHJvYmxlbXMucHVzaCBwcm9ibGVtXG5cbiAgc2F2ZV9kaWZmaWN1bHR5OiAtPlxuICAgICAgQHByb2ZpbGVEYXRhLmRpZmZpY3VsdHkgPSBAZGlmZmljdWx0eVxuICAgICAgQHByb2ZpbGVEYXRhLiR1cGRhdGUoKVxuXG4gIHJlYWRhYmxlX2RpZmZpY3VsdHk6IC0+XG4gICAgICBzd2l0Y2ggcGFyc2VJbnQoQGRpZmZpY3VsdHkpXG4gICAgICAgICAgd2hlbiAwXG4gICAgICAgICAgICAgICdWZXJ5IEVhc3knXG4gICAgICAgICAgd2hlbiAxXG4gICAgICAgICAgICAgICdFYXN5J1xuICAgICAgICAgIHdoZW4gMlxuICAgICAgICAgICAgICAnTWVkaXVtJ1xuICAgICAgICAgIHdoZW4gM1xuICAgICAgICAgICAgICAnSGFyZCdcbiAgICAgICAgICB3aGVuIDRcbiAgICAgICAgICAgICAgJ1ZlcnkgSGFyZCdcblxuICBjb25zdHJ1Y3RvcjogKEAkbW9kZWxzKSAtPlxuICAgIEAkbW9kZWxzLlByb2JsZW0uc3RhcnJlZCAoZGF0YSkgPT5cbiAgICAgIEBwYXJzZU5leHQgZGF0YS5uZXh0XG4gICAgICBAc3RhckNvdW50ID0gZGF0YS5jb3VudFxuICAgICAgQHN0YXJyZWRQcm9ibGVtcyA9IGRhdGEucmVzdWx0c1xuICAgICAgQHN0YXJEYXRhID0gZGF0YVxuXG4gICAgQCRtb2RlbHMuUHJvZmlsZS5tZSAoZGF0YSkgPT5cbiAgICAgIEBkaWZmaWN1bHR5ID0gZGF0YS5kaWZmaWN1bHR5XG4gICAgICBAcHJvZmlsZURhdGEgPSBkYXRhXG5cbm1vZHVsZS5leHBvcnRzID0gUGVyc29uQ3RybFxuIiwiY2xhc3MgUHJvYmxlbUN0cmxcbiAgcHJvYmxlbURhdGE6IG51bGxcblxuICBkYXRlOiAnJ1xuICBwcm9ibGVtSWQ6ICcnXG4gIHByb2JsZW1OYW1lOiAnJ1xuICBwcm9ibGVtU3RhdGVtZW50OiAnJ1xuICB0YWdzOiBbXVxuICBoYXNfc3RhcjogZmFsc2VcbiAgY29tbWVudHM6IFtdXG4gIG5ld0NvbW1lbnRDb250ZW50OiAnJ1xuICBkaXNhYmxlQ29tbWVudDogZmFsc2VcblxuICBnZXRfZGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGUgPSBkYXRhLmRhdGVcbiAgICBAcHJvYmxlbUlkID0gZGF0YS5wcm9ibGVtSWRcbiAgICBAcHJvYmxlbU5hbWUgPSBkYXRhLnByb2JsZW1OYW1lXG4gICAgQHByb2JsZW1TdGF0ZW1lbnQgPSBkYXRhLnByb2JsZW1TdGF0ZW1lbnRcbiAgICBAdGFncyA9ICh0YWcudHJpbSgpIGZvciB0YWcgaW4gZGF0YS50YWdzLnNwbGl0KCcsJykpXG4gICAgQHByb2JsZW1EYXRhID0gZGF0YVxuICAgIEAkbW9kZWxzLlByb2JsZW0uaGFzX3N0YXIgaWQ6IEBwcm9ibGVtSWQsIChyZXMpID0+IEBoYXNfc3RhciA9IHJlcy5oYXNfc3RhclxuXG4gIGdldF9jb21tZW50X2RhdGE6IChkYXRhKSAtPlxuICAgIEBjb21tZW50cyA9IGRhdGFcblxuICBzdGFyOiAtPlxuICAgIEAkbW9kZWxzLlByb2JsZW0uc3RhciBpZDogQHByb2JsZW1JZCwgKHJlcykgPT5cbiAgICAgIEBoYXNfc3RhciA9IHRydWUgaWYgcmVzLnN0YXR1cyA9PSAnb2snXG5cbiAgdW5zdGFyOiAtPlxuICAgIEAkbW9kZWxzLlByb2JsZW0udW5zdGFyIGlkOiBAcHJvYmxlbUlkLCAocmVzKSA9PlxuICAgICAgQGhhc19zdGFyID0gZmFsc2UgaWYgcmVzLnN0YXR1cyA9PSAnb2snXG5cbiAgY29tbWVudEludmFsaWQ6IC0+XG4gICAgICByZXR1cm4gQG5ld0NvbW1lbnRDb250ZW50LnRyaW0oKS5sZW5ndGggPT0gMFxuXG4gIGNvbW1lbnQ6IC0+XG4gICAgICByZXR1cm4gaWYgQGNvbW1lbnRJbnZhbGlkKClcblxuICAgICAgY29udGVudCA9IEBuZXdDb21tZW50Q29udGVudC50cmltKClcbiAgICAgIEBkaXNhYmxlQ29tbWVudCA9IHRydWVcbiAgICAgIG5ld0NvbW1lbnQgPSBuZXcgQCRtb2RlbHMuQ29tbWVudFxuICAgICAgICBwcm9ibGVtOiBAcHJvYmxlbUlkXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcbiAgICAgIG5ld0NvbW1lbnQuJHNhdmUgKGRhdGEpID0+XG4gICAgICAgICAgQGNvbW1lbnRzLnVuc2hpZnQgZGF0YVxuICAgICAgICAgIEBuZXdDb21tZW50Q29udGVudCA9ICcnXG4gICAgICAgICAgQGRpc2FibGVDb21tZW50ID0gZmFsc2VcblxuICBjbGVhckNvbW1lbnQ6IC0+XG4gICAgQG5ld0NvbW1lbnRDb250ZW50ID0gJydcblxuICBjb25zdHJ1Y3RvcjogKCRyb3V0ZVBhcmFtcywgQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuUHJvYmxlbS5nZXQgaWQ6ICRyb3V0ZVBhcmFtcy5pZCwgKGRhdGEpID0+IEBnZXRfZGF0YShkYXRhKVxuICAgIEAkbW9kZWxzLkNvbW1lbnQucXVlcnkgcHJvYmxlbTogJHJvdXRlUGFyYW1zLmlkLCAoZGF0YSkgPT4gQGdldF9jb21tZW50X2RhdGEoZGF0YSlcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9ibGVtQ3RybFxuIiwidGVtcGxhdGVfcGF0aCA9IHJlcXVpcmUoJy4vdXRpbHMuY29mZmVlJykudGVtcGxhdGVfcGF0aFxuXG5pbml0U3dpcGVBY3Rpb24gPSAoc2NvcGUsIGVsZW1lbnQsICRzd2lwZSkgLT5cbiAgc2NvcGUuZG9uZV9hY3Rpb24gPSBzY29wZS5hY3Rpb25cbiAgc3dpcGVFbGVtZW50ID0gZWxlbWVudC5jaGlsZHJlbigpXG4gIG9yaWdpblggPSAwXG4gIHN3aXBlT2Zmc2V0ID0gMFxuICBjYW5jZWxpbmdPZmZzZXQgPSBmYWxzZVxuXG4gIGdldE9mZnNldCA9ICh4KSAtPlxuICAgIG9mZnNldCA9IHggLSBvcmlnaW5YXG4gICAgb2Zmc2V0ID0gMCBpZiBvZmZzZXQgPiAwXG4gICAgc3dpcGVPZmZzZXQgPSAxMDAgLSAxMDAgKiBNYXRoLnBvdygxLjIsIG9mZnNldC8xMClcblxuICB1cGRhdGVPZmZzZXQgPSAtPlxuICAgIHN3aXBlRWxlbWVudC5hdHRyICdzdHlsZScsIFwiLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgtI3tzd2lwZU9mZnNldH1weCwgMCk7dHJhbnNmb3JtOiB0cmFuc2xhdGUoLSN7c3dpcGVPZmZzZXR9cHgsIDApXCJcblxuICAkc3dpcGUuYmluZCBlbGVtZW50LFxuICAgIHN0YXJ0OiAob2JqKSAtPlxuICAgICAgaWYgbm90IHNjb3BlLnByb2JsZW0uZG9uZVxuICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdub3QtdG91Y2hpbmcnKVxuICAgICAgICBvcmlnaW5YID0gb2JqLnhcbiAgICBtb3ZlOiAob2JqKSAtPlxuICAgICAgaWYgbm90IHNjb3BlLnByb2JsZW0uZG9uZVxuICAgICAgICBnZXRPZmZzZXQob2JqLngpXG4gICAgICAgIHVwZGF0ZU9mZnNldChvYmoueClcbiAgICBlbmQ6IChvYmopIC0+XG4gICAgICBpZiBub3Qgc2NvcGUucHJvYmxlbS5kb25lXG4gICAgICAgIHNjb3BlLmFjdGlvbigpIGlmIHN3aXBlT2Zmc2V0ID4gODBcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ25vdC10b3VjaGluZycpXG4gICAgICBzd2lwZU9mZnNldCA9IDBcbiAgICAgIHVwZGF0ZU9mZnNldCgpXG4gICAgY2FuY2VsOiAob2JqKSAtPlxuICAgICAgZWxlbWVudC5hZGRDbGFzcygnbm90LXRvdWNoaW5nJylcbiAgICAgIHN3aXBlT2Zmc2V0ID0gMFxuICAgICAgdXBkYXRlT2Zmc2V0KClcblxubW9kdWxlLmV4cG9ydHMgPSAoJGxvY2F0aW9uLCAkc3dpcGUpIC0+XG4gIHJlc3RyaWN0OiAnRSdcbiAgc2NvcGU6XG4gICAgdHlwZTogJz0nXG4gICAgcHJvYmxlbTogJz0nXG4gICAgYWN0aW9uOiAnJidcbiAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJy9wcm9ibGVtX2RpcmVjdGl2ZS5odG1sJylcblxuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQpIC0+XG4gICAgc2NvcGUuZGV0YWlsX2FjdGlvbj0gLT5cbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcHJvYmxlbS8nICsgc2NvcGUucHJvYmxlbS5vcmlnaW5Qcm9ibGVtKVxuXG4gICAgaWYgc2NvcGUudHlwZSA9PSAnc3RhcidcbiAgICAgIHNjb3BlLmlzX3N0YXIgPSB0cnVlXG4gICAgZWxzZVxuICAgICAgc2NvcGUuaXNfYXNzaWdubWVudCA9IHRydWVcblxuICAgIGNvbnNvbGUubG9nIHNjb3BlXG5cbiAgICBpZiBzY29wZS5hY3Rpb24gYW5kIChub3Qgc2NvcGUucHJvYmxlbS5kb25lKSBhbmQgc2NvcGUuaXNfYXNzaWdubWVudFxuICAgICAgaW5pdFN3aXBlQWN0aW9uKHNjb3BlLCBlbGVtZW50LCAkc3dpcGUpXG4iLCJjbGFzcyBzaGVldEN0cmxcbiAgc2hlZXREYXRhOiBudWxsXG4gIGRhdGU6ICcnXG4gIG51bWJlcjogMFxuICBwcm9ibGVtczogJydcbiAgaGFzX292ZXJkdWU6IGZhbHNlXG4gIGhhc19uZXc6IGZhbHNlXG4gIGhhc19yZXZpZXc6IGZhbHNlXG4gIGlzX2xhc3Q6IHRydWVcbiAgbm9uZTogZmFsc2VcblxuICBnZXRfZGF0YTogKGRhdGEpIC0+XG4gICAgaWYgZGF0YS5ub25lXG4gICAgICBAbm9uZSA9IHRydWVcbiAgICAgIHJldHVyblxuICAgIEBpc19sYXN0ID0gZGF0YS5pc19sYXN0XG4gICAgQGRhdGUgPSBkYXRhLmRhdGVcbiAgICBAbnVtYmVyID0gZGF0YS5udW1iZXJcbiAgICBAcHJvYmxlbXMgPSBkYXRhLnByb2JsZW1zXG4gICAgQHRhZ3MgPSBbXVxuICAgIHRhZ01hcCA9IHt9XG4gICAgZm9yIHByb2JsZW0gaW4gQHByb2JsZW1zXG4gICAgICB0YWdzID0gcHJvYmxlbS50YWdzLnNwbGl0KCcsJylcbiAgICAgIGZvciB0YWcgaW4gdGFnc1xuICAgICAgICB0YWcgPSB0YWcudHJpbSgpXG4gICAgICAgIGlmIHRhZyAgYW5kICghdGFnTWFwW3RhZ10pXG4gICAgICAgICAgQHRhZ3MucHVzaCB0YWdcbiAgICAgICAgICB0YWdNYXBbdGFnXSA9IHRydWVcbiAgICAgIHN3aXRjaCBwcm9ibGVtLnR5cGVcbiAgICAgICAgd2hlbiAnb3ZlcmR1ZSdcbiAgICAgICAgICBAaGFzX292ZXJkdWUgPSB0cnVlXG4gICAgICAgIHdoZW4gJ25ldydcbiAgICAgICAgICBAaGFzX25ldyA9IHRydWVcbiAgICAgICAgd2hlbiAncmV2aWV3J1xuICAgICAgICAgIEBoYXNfcmV2aWV3ID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgQHNoZWV0RGF0YSA9IGRhdGFcblxuICBkb25lOiAocHJvYmxlbSkgLT5cbiAgICBAJG1vZGVscy5Bc3NpZ25tZW50LmRvbmUgaWQ6IHByb2JsZW0uaWQsIChkYXRhKSA9PlxuICAgICAgcHJvYmxlbS5kb25lID0gdHJ1ZVxuIFxuICBjb25zdHJ1Y3RvcjogKCRyb3V0ZVBhcmFtcywgQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuU2hlZXQuZ2V0IG51bWJlcjogJHJvdXRlUGFyYW1zLm51bWJlciwgKGRhdGEpID0+IEBnZXRfZGF0YShkYXRhKVxuICAgICAgXG5cbm1vZHVsZS5leHBvcnRzID0gc2hlZXRDdHJsXG4iLCJ0ZW1wbGF0ZV9wYXRoID0gKHBhdGgpIC0+XG4gIHBhdGggPz0gJydcbiAgcmV0dXJuIFRFTVBMQVRFX1BBVEhfQkFTRSArICcvJyArIHBhdGhcblxuYXBpX3BhdGggPSAocGF0aCkgLT5cbiAgcmV0dXJuIEFQSV9QQVRIX0JBU0UgKyBwYXRoXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYXBpX3BhdGg6IGFwaV9wYXRoXG4gIHRlbXBsYXRlX3BhdGg6IHRlbXBsYXRlX3BhdGhcbiJdfQ==
