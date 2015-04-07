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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2RvbmVDdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tb2RlbHMuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1DdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9zaGVldEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3V0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QUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxFQURJO0VBQUEsQ0FqQ04sQ0FBQTs7QUFxQ2EsRUFBQSxtQkFBQyxZQUFELEVBQWUsT0FBZixHQUFBO0FBQ1gsSUFEMEIsSUFBQyxDQUFBLFVBQUQsT0FDMUIsQ0FBQTtBQUFBLElBQUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBZixDQUFtQjtBQUFBLE1BQUEsTUFBQSxFQUFRLFlBQVksQ0FBQyxNQUFyQjtLQUFuQixFQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2FBQUEsU0FBQyxJQUFELEdBQUE7ZUFBVSxLQUFDLENBQUEsUUFBRCxDQUFVLElBQVYsRUFBVjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhELENBQUEsQ0FEVztFQUFBLENBckNiOzttQkFBQTs7SUFERixDQUFBOztBQUFBLE1BMENNLENBQUMsT0FBUCxHQUFpQixTQTFDakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLHVCQUFBOztBQUFBLGFBQUEsR0FBZ0IsU0FBQyxJQUFELEdBQUE7O0lBQ2QsT0FBUTtHQUFSO0FBQ0EsU0FBTyxrQkFBQSxHQUFxQixHQUFyQixHQUEyQixJQUFsQyxDQUZjO0FBQUEsQ0FBaEIsQ0FBQTs7QUFBQSxRQUlBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxTQUFPLGFBQUEsR0FBZ0IsSUFBdkIsQ0FEUztBQUFBLENBSlgsQ0FBQTs7QUFBQSxNQU9NLENBQUMsT0FBUCxHQUNFO0FBQUEsRUFBQSxRQUFBLEVBQVUsUUFBVjtBQUFBLEVBQ0EsYUFBQSxFQUFlLGFBRGY7Q0FSRixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIEFwcEN0cmxcbiAgZ286IChwYXRoKSAtPlxuICAgIEAkbG9jYXRpb24ucGF0aChwYXRoKVxuXG4gIGNvbnN0cnVjdG9yOiAoQCRsb2NhdGlvbikgLT5cbiAgICBAdGl0bGUgPSAnVENIZWxwZXIgfCBhcHAnXG5cbm1vZHVsZS5leHBvcnRzID0gQXBwQ3RybFxuIiwiY2xhc3MgRG9uZUN0cmxcbiAgZG9uZURhdGE6IG51bGxcbiAgbmV4dDogbnVsbFxuICBjb3VudDogMFxuICBwcm9ibGVtczogW11cblxuICBwYXJzZU5leHQ6IChuZXh0KS0+XG4gICAgaWYgbmV4dFxuICAgICAgbWF0Y2ggPSBuZXh0Lm1hdGNoIC9wYWdlPShcXGQrKS9cbiAgICAgIGlmIG1hdGNoLmxlbmd0aCA9PSAyXG4gICAgICAgIEBuZXh0ID0gcGFyc2VJbnQobWF0Y2hbMV0pXG4gICAgICAgIHJldHVyblxuICAgIEBuZXh0ID0gbnVsbFxuICBcbiAgbG9hZF9tb3JlOiAtPlxuICAgIEAkbW9kZWxzLkFzc2lnbm1lbnQuc29sdmVkIHBhZ2U6IEBuZXh0LCAoZGF0YSkgPT5cbiAgICAgIGZvciBwcm9ibGVtIGluIGRhdGEucmVzdWx0c1xuICAgICAgICBAcGFyc2VOZXh0IGRhdGEubmV4dFxuICAgICAgICBAcHJvYmxlbXMucHVzaCBwcm9ibGVtXG5cbiAgY29uc3RydWN0b3I6IChAJG1vZGVscykgLT5cbiAgICBAJG1vZGVscy5Bc3NpZ25tZW50LnNvbHZlZCAoZGF0YSkgPT5cbiAgICAgIEBwYXJzZU5leHQgZGF0YS5uZXh0XG4gICAgICBAY291bnQgPSBkYXRhLmNvdW50XG4gICAgICBAcHJvYmxlbXMgPSBkYXRhLnJlc3VsdHNcbiAgICAgIEBkb25lRGF0YSA9IGRhdGFcblxuXG5tb2R1bGUuZXhwb3J0cyA9IERvbmVDdHJsXG4iLCJ1dGlscyA9IHJlcXVpcmUgJy4vdXRpbHMuY29mZmVlJ1xuXG5hcHBDdHJsID0gcmVxdWlyZSAnLi9hcHBDdHJsLmNvZmZlZSdcbnNoZWV0Q3RybCA9IHJlcXVpcmUgJy4vc2hlZXRDdHJsLmNvZmZlZSdcbmRvbmVDdHJsID0gcmVxdWlyZSAnLi9kb25lQ3RybC5jb2ZmZWUnXG5wZXJzb25DdHJsID0gcmVxdWlyZSAnLi9wZXJzb25DdHJsLmNvZmZlZSdcbnByb2JsZW1DdHJsID0gcmVxdWlyZSAnLi9wcm9ibGVtQ3RybC5jb2ZmZWUnXG5cbnByb2JsZW1EaXJlY3RpdmUgPSByZXF1aXJlICcuL3Byb2JsZW1EaXJlY3RpdmUuY29mZmVlJ1xuXG5tb2RlbHMgPSByZXF1aXJlICcuL21vZGVscy5jb2ZmZWUnXG5cbnRlbXBsYXRlX3BhdGggPSB1dGlscy50ZW1wbGF0ZV9wYXRoXG5cbmFuZ3VsYXIubW9kdWxlKCd0Y2hBcHAnLCBbXG4gICduZ1JvdXRlJyxcbiAgJ25nVG91Y2gnLFxuICAnbmdBbmltYXRlJyxcbiAgJ25nU2FuaXRpemUnLFxuICAnbmdSZXNvdXJjZScsXG4gICdhbmd1bGFyLWxvYWRpbmctYmFyJyxcbl0pXG4gIC5jb250cm9sbGVyICdhcHBDdHJsJywgYXBwQ3RybFxuICAuY29udHJvbGxlciAnc2hlZXRDdHJsJywgc2hlZXRDdHJsXG4gIC5jb250cm9sbGVyICdkb25lQ3RybCcsIGRvbmVDdHJsXG4gIC5jb250cm9sbGVyICdwZXJzb25DdHJsJywgcGVyc29uQ3RybFxuICAuY29udHJvbGxlciAncHJvYmxlbUN0cmwnLCBwcm9ibGVtQ3RybFxuXG4gIC5kaXJlY3RpdmUgJ3Byb2JsZW0nLCBwcm9ibGVtRGlyZWN0aXZlXG5cbiAgLmZhY3RvcnkgJyRtb2RlbHMnLCBtb2RlbHNcblxuICAuY29uZmlnICgkcm91dGVQcm92aWRlcikgLT5cbiAgICAkcm91dGVQcm92aWRlclxuICAgICAgLndoZW4gJy9zaGVldC86bnVtYmVyJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3NoZWV0Q3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAnc2hlZXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdzaGVldC5odG1sJylcbiAgICAgIC53aGVuICcvZG9uZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdkb25lQ3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAnZG9uZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ2RvbmUuaHRtbCcpXG4gICAgICAud2hlbiAnL3BlcnNvbicsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdwZXJzb25DdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdwZXJzb24nXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdwZXJzb24uaHRtbCcpXG4gICAgICAud2hlbiAnL3Byb2JsZW0vOmlkJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3Byb2JsZW1DdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdwcm9ibGVtJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgncHJvYmxlbS5odG1sJylcbiAgICAgIC5vdGhlcndpc2VcbiAgICAgICAgcmVkaXJlY3RUbzogJy9zaGVldC9sYXRlc3QnXG5cbiAgLmNvbmZpZyAoJHJlc291cmNlUHJvdmlkZXIpIC0+XG4gICAgJHJlc291cmNlUHJvdmlkZXIuZGVmYXVsdHMuc3RyaXBUcmFpbGluZ1NsYXNoZXMgPSBmYWxzZVxuXG4gIC5jb25maWcgKCRsb2NhdGlvblByb3ZpZGVyKSAtPlxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSB0cnVlXG5cbiAgLmNvbmZpZyAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKSAtPlxuICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlXG5cbiAgLmNvbmZpZyAoJGh0dHBQcm92aWRlcikgLT5cbiAgICBjc3JmX3Rva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPWNzcmYtdG9rZW5dJykuY29udGVudFxuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQ1NSRlRva2VuJ10gPSBjc3JmX3Rva2VuXG4iLCJ1dGlscyA9IHJlcXVpcmUgJy4vdXRpbHMuY29mZmVlJ1xuXG5hcGlfcGF0aCA9IHV0aWxzLmFwaV9wYXRoXG5cbm1vZHVsZS5leHBvcnRzID0gKCRyZXNvdXJjZSkgLT5cbiAgJ1Byb2JsZW0nOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC8nKSwge2lkOiAnQGlkJ30sXG4gICAgICBzdGFycmVkOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvc3RhcnJlZC8nKVxuICAgICAgaGFzX3N0YXI6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9ibGVtcy86aWQvaGFzX3N0YXInKVxuICAgICAgICBwYXJhbXM6IHtpZDogJ0Bwcm9ibGVtSWQnfVxuICAgICAgc3RhcjpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC9zdGFyLycpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQGlkJ31cbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgIHVuc3RhcjpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC91bnN0YXIvJylcbiAgICAgICAgcGFyYW1zOiB7aWQ6ICdAaWQnfVxuICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuXG4gICdBc3NpZ25tZW50JzpcbiAgICAkcmVzb3VyY2UgYXBpX3BhdGgoJy9hc3NpZ25tZW50cy86aWQnKSwge2lkOiAnQGlkJ30sXG4gICAgICBzb2x2ZWQ6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9hc3NpZ25tZW50cy9zb2x2ZWQnKVxuICAgICAgZG9uZTpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL2Fzc2lnbm1lbnRzLzppZC9kb25lLycpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQGlkJ31cbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcblxuICAnU2hlZXQnOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3NoZWV0cy86bnVtYmVyJyksIHtudW1iZXI6ICdAbnVtYmVyJ31cbiIsImNsYXNzIFBlcnNvbkN0cmxcbiAgc3RhckRhdGE6IG51bGxcbiAgbmV4dDogbnVsbFxuICBzdGFyQ291bnQ6IDBcbiAgc3RhcnJlZFByb2JsZW1zOiBbXVxuICBkZWFjdGl2YXRlX3BhdGg6IERFQUNUSVZBVEVfUEFUSFxuICBsb2dvdXRfcGF0aDogTE9HT1VUX1BBVEhcblxuICBwYXJzZU5leHQ6IChuZXh0KS0+XG4gICAgaWYgbmV4dFxuICAgICAgbWF0Y2ggPSBuZXh0Lm1hdGNoIC9wYWdlPShcXGQrKS9cbiAgICAgIGlmIG1hdGNoLmxlbmd0aCA9PSAyXG4gICAgICAgIEBuZXh0ID0gcGFyc2VJbnQobWF0Y2hbMV0pXG4gICAgICAgIHJldHVyblxuICAgIEBuZXh0ID0gbnVsbFxuICBcbiAgbG9hZF9tb3JlOiAtPlxuICAgIEAkbW9kZWxzLlByb2JsZW0uc3RhcnJlZCBwYWdlOiBAbmV4dCwgKGRhdGEpID0+XG4gICAgICBmb3IgcHJvYmxlbSBpbiBkYXRhLnJlc3VsdHNcbiAgICAgICAgQHBhcnNlTmV4dCBkYXRhLm5leHRcbiAgICAgICAgQHN0YXJyZWRQcm9ibGVtcy5wdXNoIHByb2JsZW1cblxuICBjb25zdHJ1Y3RvcjogKEAkbW9kZWxzKSAtPlxuICAgIEAkbW9kZWxzLlByb2JsZW0uc3RhcnJlZCAoZGF0YSkgPT5cbiAgICAgIEBwYXJzZU5leHQgZGF0YS5uZXh0XG4gICAgICBAc3RhckNvdW50ID0gZGF0YS5jb3VudFxuICAgICAgQHN0YXJyZWRQcm9ibGVtcyA9IGRhdGEucmVzdWx0c1xuICAgICAgQHN0YXJEYXRhID0gZGF0YVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBlcnNvbkN0cmxcbiIsImNsYXNzIFByb2JsZW1DdHJsXG4gIHByb2JsZW1EYXRhOiBudWxsXG5cbiAgZGF0ZTogJydcbiAgcHJvYmxlbUlkOiAnJ1xuICBwcm9ibGVtTmFtZTogJydcbiAgcHJvYmxlbVN0YXRlbWVudDogJydcbiAgdGFnczogW11cbiAgaGFzX3N0YXI6IGZhbHNlXG5cbiAgZ2V0X2RhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRlID0gZGF0YS5kYXRlXG4gICAgQHByb2JsZW1JZCA9IGRhdGEucHJvYmxlbUlkXG4gICAgQHByb2JsZW1OYW1lID0gZGF0YS5wcm9ibGVtTmFtZVxuICAgIEBwcm9ibGVtU3RhdGVtZW50ID0gZGF0YS5wcm9ibGVtU3RhdGVtZW50XG4gICAgQHRhZ3MgPSAodGFnLnRyaW0oKSBmb3IgdGFnIGluIGRhdGEudGFncy5zcGxpdCgnLCcpKVxuICAgIEBwcm9ibGVtRGF0YSA9IGRhdGFcbiAgICBAJG1vZGVscy5Qcm9ibGVtLmhhc19zdGFyIGlkOiBAcHJvYmxlbUlkLCAocmVzKSA9PiBAaGFzX3N0YXIgPSByZXMuaGFzX3N0YXJcblxuICBzdGFyOiAtPlxuICAgIEAkbW9kZWxzLlByb2JsZW0uc3RhciBpZDogQHByb2JsZW1JZCwgKHJlcykgPT5cbiAgICAgIEBoYXNfc3RhciA9IHRydWUgaWYgcmVzLnN0YXR1cyA9PSAnb2snXG5cbiAgdW5zdGFyOiAtPlxuICAgIEAkbW9kZWxzLlByb2JsZW0udW5zdGFyIGlkOiBAcHJvYmxlbUlkLCAocmVzKSA9PlxuICAgICAgQGhhc19zdGFyID0gZmFsc2UgaWYgcmVzLnN0YXR1cyA9PSAnb2snXG5cbiAgY29uc3RydWN0b3I6ICgkcm91dGVQYXJhbXMsIEAkbW9kZWxzKSAtPlxuICAgIEAkbW9kZWxzLlByb2JsZW0uZ2V0IGlkOiAkcm91dGVQYXJhbXMuaWQsIChkYXRhKSA9PiBAZ2V0X2RhdGEoZGF0YSlcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9ibGVtQ3RybFxuIiwidGVtcGxhdGVfcGF0aCA9IHJlcXVpcmUoJy4vdXRpbHMuY29mZmVlJykudGVtcGxhdGVfcGF0aFxuXG5pbml0U3dpcGVBY3Rpb24gPSAoc2NvcGUsIGVsZW1lbnQsICRzd2lwZSkgLT5cbiAgc2NvcGUuZG9uZV9hY3Rpb24gPSBzY29wZS5hY3Rpb25cbiAgc3dpcGVFbGVtZW50ID0gZWxlbWVudC5jaGlsZHJlbigpXG4gIG9yaWdpblggPSAwXG4gIHN3aXBlT2Zmc2V0ID0gMFxuICBjYW5jZWxpbmdPZmZzZXQgPSBmYWxzZVxuXG4gIGdldE9mZnNldCA9ICh4KSAtPlxuICAgIG9mZnNldCA9IHggLSBvcmlnaW5YXG4gICAgb2Zmc2V0ID0gMCBpZiBvZmZzZXQgPiAwXG4gICAgc3dpcGVPZmZzZXQgPSAxMDAgLSAxMDAgKiBNYXRoLnBvdygxLjIsIG9mZnNldC8xMClcblxuICB1cGRhdGVPZmZzZXQgPSAtPlxuICAgIHN3aXBlRWxlbWVudC5hdHRyICdzdHlsZScsIFwiLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgtI3tzd2lwZU9mZnNldH1weCwgMCk7dHJhbnNmb3JtOiB0cmFuc2xhdGUoLSN7c3dpcGVPZmZzZXR9cHgsIDApXCJcblxuICAkc3dpcGUuYmluZCBlbGVtZW50LFxuICAgIHN0YXJ0OiAob2JqKSAtPlxuICAgICAgaWYgbm90IHNjb3BlLnByb2JsZW0uZG9uZVxuICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdub3QtdG91Y2hpbmcnKVxuICAgICAgICBvcmlnaW5YID0gb2JqLnhcbiAgICBtb3ZlOiAob2JqKSAtPlxuICAgICAgaWYgbm90IHNjb3BlLnByb2JsZW0uZG9uZVxuICAgICAgICBnZXRPZmZzZXQob2JqLngpXG4gICAgICAgIHVwZGF0ZU9mZnNldChvYmoueClcbiAgICBlbmQ6IChvYmopIC0+XG4gICAgICBpZiBub3Qgc2NvcGUucHJvYmxlbS5kb25lXG4gICAgICAgIHNjb3BlLmFjdGlvbigpIGlmIHN3aXBlT2Zmc2V0ID4gODBcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ25vdC10b3VjaGluZycpXG4gICAgICBzd2lwZU9mZnNldCA9IDBcbiAgICAgIHVwZGF0ZU9mZnNldCgpXG4gICAgY2FuY2VsOiAob2JqKSAtPlxuICAgICAgZWxlbWVudC5hZGRDbGFzcygnbm90LXRvdWNoaW5nJylcbiAgICAgIHN3aXBlT2Zmc2V0ID0gMFxuICAgICAgdXBkYXRlT2Zmc2V0KClcblxubW9kdWxlLmV4cG9ydHMgPSAoJGxvY2F0aW9uLCAkc3dpcGUpIC0+XG4gIHJlc3RyaWN0OiAnRSdcbiAgc2NvcGU6XG4gICAgdHlwZTogJz0nXG4gICAgcHJvYmxlbTogJz0nXG4gICAgYWN0aW9uOiAnJidcbiAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJy9wcm9ibGVtX2RpcmVjdGl2ZS5odG1sJylcblxuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQpIC0+XG4gICAgc2NvcGUuZGV0YWlsX2FjdGlvbj0gLT5cbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcHJvYmxlbS8nICsgc2NvcGUucHJvYmxlbS5vcmlnaW5Qcm9ibGVtKVxuXG4gICAgaWYgc2NvcGUudHlwZSA9PSAnc3RhcidcbiAgICAgIHNjb3BlLmlzX3N0YXIgPSB0cnVlXG4gICAgZWxzZVxuICAgICAgc2NvcGUuaXNfYXNzaWdubWVudCA9IHRydWVcblxuICAgIGNvbnNvbGUubG9nIHNjb3BlXG5cbiAgICBpZiBzY29wZS5hY3Rpb24gYW5kIChub3Qgc2NvcGUucHJvYmxlbS5kb25lKSBhbmQgc2NvcGUuaXNfYXNzaWdubWVudFxuICAgICAgaW5pdFN3aXBlQWN0aW9uKHNjb3BlLCBlbGVtZW50LCAkc3dpcGUpXG4iLCJjbGFzcyBzaGVldEN0cmxcbiAgc2hlZXREYXRhOiBudWxsXG4gIGRhdGU6ICcnXG4gIG51bWJlcjogMFxuICBwcm9ibGVtczogJydcbiAgaGFzX292ZXJkdWU6IGZhbHNlXG4gIGhhc19uZXc6IGZhbHNlXG4gIGhhc19yZXZpZXc6IGZhbHNlXG4gIGlzX2xhc3Q6IHRydWVcblxuICBnZXRfZGF0YTogKGRhdGEpIC0+XG4gICAgQGlzX2xhc3QgPSBkYXRhLmlzX2xhc3RcbiAgICBAZGF0ZSA9IGRhdGEuZGF0ZVxuICAgIEBudW1iZXIgPSBkYXRhLm51bWJlclxuICAgIEBwcm9ibGVtcyA9IGRhdGEucHJvYmxlbXNcbiAgICBAdGFncyA9IFtdXG4gICAgdGFnTWFwID0ge31cbiAgICBmb3IgcHJvYmxlbSBpbiBAcHJvYmxlbXNcbiAgICAgIHRhZ3MgPSBwcm9ibGVtLnRhZ3Muc3BsaXQoJywnKVxuICAgICAgZm9yIHRhZyBpbiB0YWdzXG4gICAgICAgIHRhZyA9IHRhZy50cmltKClcbiAgICAgICAgaWYgdGFnICBhbmQgKCF0YWdNYXBbdGFnXSlcbiAgICAgICAgICBAdGFncy5wdXNoIHRhZ1xuICAgICAgICAgIHRhZ01hcFt0YWddID0gdHJ1ZVxuICAgICAgc3dpdGNoIHByb2JsZW0udHlwZVxuICAgICAgICB3aGVuICdvdmVyZHVlJ1xuICAgICAgICAgIEBoYXNfb3ZlcmR1ZSA9IHRydWVcbiAgICAgICAgd2hlbiAnbmV3J1xuICAgICAgICAgIEBoYXNfbmV3ID0gdHJ1ZVxuICAgICAgICB3aGVuICdyZXZpZXcnXG4gICAgICAgICAgQGhhc19yZXZpZXcgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICBAc2hlZXREYXRhID0gZGF0YVxuXG4gIGRvbmU6IChwcm9ibGVtKSAtPlxuICAgIEAkbW9kZWxzLkFzc2lnbm1lbnQuZG9uZSBpZDogcHJvYmxlbS5pZCwgKGRhdGEpID0+XG4gICAgICBwcm9ibGVtLmRvbmUgPSB0cnVlXG4gXG4gIGNvbnN0cnVjdG9yOiAoJHJvdXRlUGFyYW1zLCBAJG1vZGVscykgLT5cbiAgICBAJG1vZGVscy5TaGVldC5nZXQgbnVtYmVyOiAkcm91dGVQYXJhbXMubnVtYmVyLCAoZGF0YSkgPT4gQGdldF9kYXRhKGRhdGEpXG4gICAgICBcblxubW9kdWxlLmV4cG9ydHMgPSBzaGVldEN0cmxcbiIsInRlbXBsYXRlX3BhdGggPSAocGF0aCkgLT5cbiAgcGF0aCA/PSAnJ1xuICByZXR1cm4gVEVNUExBVEVfUEFUSF9CQVNFICsgJy8nICsgcGF0aFxuXG5hcGlfcGF0aCA9IChwYXRoKSAtPlxuICByZXR1cm4gQVBJX1BBVEhfQkFTRSArIHBhdGhcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhcGlfcGF0aDogYXBpX3BhdGhcbiAgdGVtcGxhdGVfcGF0aDogdGVtcGxhdGVfcGF0aFxuIl19
