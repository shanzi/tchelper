(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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



},{}],2:[function(require,module,exports){
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



},{}],3:[function(require,module,exports){
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



},{"./appCtrl.coffee":1,"./doneCtrl.coffee":2,"./models.coffee":4,"./personCtrl.coffee":5,"./problemCtrl.coffee":6,"./problemDirective.coffee":7,"./sheetCtrl.coffee":8,"./utils.coffee":9}],4:[function(require,module,exports){
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
    'Comment': $resource(api_path('/comments/'), {})
  };
};



},{"./utils.coffee":9}],5:[function(require,module,exports){
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



},{}],6:[function(require,module,exports){
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



},{}],7:[function(require,module,exports){
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



},{"./utils.coffee":9}],8:[function(require,module,exports){
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



},{}],9:[function(require,module,exports){
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



},{}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy5udm0vdjAuMTEuMTQvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUvY2hhc2UvY29kZXMvdGNoZWxwZXIvZnJvbnRwYWdlL3N0YXRpYy9jb2ZmZWUvYXBwQ3RybC5jb2ZmZWUiLCIvaG9tZS9jaGFzZS9jb2Rlcy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9kb25lQ3RybC5jb2ZmZWUiLCIvaG9tZS9jaGFzZS9jb2Rlcy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9ob21lL2NoYXNlL2NvZGVzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL21vZGVscy5jb2ZmZWUiLCIvaG9tZS9jaGFzZS9jb2Rlcy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9wZXJzb25DdHJsLmNvZmZlZSIsIi9ob21lL2NoYXNlL2NvZGVzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1DdHJsLmNvZmZlZSIsIi9ob21lL2NoYXNlL2NvZGVzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1EaXJlY3RpdmUuY29mZmVlIiwiL2hvbWUvY2hhc2UvY29kZXMvdGNoZWxwZXIvZnJvbnRwYWdlL3N0YXRpYy9jb2ZmZWUvc2hlZXRDdHJsLmNvZmZlZSIsIi9ob21lL2NoYXNlL2NvZGVzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3V0aWxzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEsT0FBQTs7QUFBQTtBQUNFLG9CQUFBLEVBQUEsR0FBSSxTQUFDLElBQUQsR0FBQTtXQUNGLElBQUMsQ0FBQSxTQUFTLENBQUMsSUFBWCxDQUFnQixJQUFoQixFQURFO0VB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QUQsR0FBQTtBQUNULFNBQU8sYUFBQSxHQUFnQixJQUF2QixDQURTO0FBQUEsQ0FKWCxDQUFBOztBQUFBLE1BT00sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxFQUFBLFFBQUEsRUFBVSxRQUFWO0FBQUEsRUFDQSxhQUFBLEVBQWUsYUFEZjtDQVJGLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgQXBwQ3RybFxuICBnbzogKHBhdGgpIC0+XG4gICAgQCRsb2NhdGlvbi5wYXRoKHBhdGgpXG5cbiAgY29uc3RydWN0b3I6IChAJGxvY2F0aW9uKSAtPlxuICAgIEB0aXRsZSA9ICdUQ0hlbHBlciB8IGFwcCdcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBDdHJsXG4iLCJjbGFzcyBEb25lQ3RybFxuICBkb25lRGF0YTogbnVsbFxuICBuZXh0OiBudWxsXG4gIGNvdW50OiAwXG4gIHByb2JsZW1zOiBbXVxuXG4gIHBhcnNlTmV4dDogKG5leHQpLT5cbiAgICBpZiBuZXh0XG4gICAgICBtYXRjaCA9IG5leHQubWF0Y2ggL3BhZ2U9KFxcZCspL1xuICAgICAgaWYgbWF0Y2gubGVuZ3RoID09IDJcbiAgICAgICAgQG5leHQgPSBwYXJzZUludChtYXRjaFsxXSlcbiAgICAgICAgcmV0dXJuXG4gICAgQG5leHQgPSBudWxsXG4gIFxuICBsb2FkX21vcmU6IC0+XG4gICAgQCRtb2RlbHMuQXNzaWdubWVudC5zb2x2ZWQgcGFnZTogQG5leHQsIChkYXRhKSA9PlxuICAgICAgZm9yIHByb2JsZW0gaW4gZGF0YS5yZXN1bHRzXG4gICAgICAgIEBwYXJzZU5leHQgZGF0YS5uZXh0XG4gICAgICAgIEBwcm9ibGVtcy5wdXNoIHByb2JsZW1cblxuICBjb25zdHJ1Y3RvcjogKEAkbW9kZWxzKSAtPlxuICAgIEAkbW9kZWxzLkFzc2lnbm1lbnQuc29sdmVkIChkYXRhKSA9PlxuICAgICAgQHBhcnNlTmV4dCBkYXRhLm5leHRcbiAgICAgIEBjb3VudCA9IGRhdGEuY291bnRcbiAgICAgIEBwcm9ibGVtcyA9IGRhdGEucmVzdWx0c1xuICAgICAgQGRvbmVEYXRhID0gZGF0YVxuXG5cbm1vZHVsZS5leHBvcnRzID0gRG9uZUN0cmxcbiIsInV0aWxzID0gcmVxdWlyZSAnLi91dGlscy5jb2ZmZWUnXG5cbmFwcEN0cmwgPSByZXF1aXJlICcuL2FwcEN0cmwuY29mZmVlJ1xuc2hlZXRDdHJsID0gcmVxdWlyZSAnLi9zaGVldEN0cmwuY29mZmVlJ1xuZG9uZUN0cmwgPSByZXF1aXJlICcuL2RvbmVDdHJsLmNvZmZlZSdcbnBlcnNvbkN0cmwgPSByZXF1aXJlICcuL3BlcnNvbkN0cmwuY29mZmVlJ1xucHJvYmxlbUN0cmwgPSByZXF1aXJlICcuL3Byb2JsZW1DdHJsLmNvZmZlZSdcblxucHJvYmxlbURpcmVjdGl2ZSA9IHJlcXVpcmUgJy4vcHJvYmxlbURpcmVjdGl2ZS5jb2ZmZWUnXG5cbm1vZGVscyA9IHJlcXVpcmUgJy4vbW9kZWxzLmNvZmZlZSdcblxudGVtcGxhdGVfcGF0aCA9IHV0aWxzLnRlbXBsYXRlX3BhdGhcblxuYW5ndWxhci5tb2R1bGUoJ3RjaEFwcCcsIFtcbiAgJ25nUm91dGUnLFxuICAnbmdUb3VjaCcsXG4gICduZ0FuaW1hdGUnLFxuICAnbmdTYW5pdGl6ZScsXG4gICduZ1Jlc291cmNlJyxcbiAgJ2FuZ3VsYXItbG9hZGluZy1iYXInLFxuICAnbW9ub3NwYWNlZC5lbGFzdGljJyxcbiAgJ3VpLmdyYXZhdGFyJyxcbl0pXG4gIC5jb250cm9sbGVyICdhcHBDdHJsJywgYXBwQ3RybFxuICAuY29udHJvbGxlciAnc2hlZXRDdHJsJywgc2hlZXRDdHJsXG4gIC5jb250cm9sbGVyICdkb25lQ3RybCcsIGRvbmVDdHJsXG4gIC5jb250cm9sbGVyICdwZXJzb25DdHJsJywgcGVyc29uQ3RybFxuICAuY29udHJvbGxlciAncHJvYmxlbUN0cmwnLCBwcm9ibGVtQ3RybFxuXG4gIC5kaXJlY3RpdmUgJ3Byb2JsZW0nLCBwcm9ibGVtRGlyZWN0aXZlXG5cbiAgLmZhY3RvcnkgJyRtb2RlbHMnLCBtb2RlbHNcblxuICAuY29uZmlnICgkcm91dGVQcm92aWRlcikgLT5cbiAgICAkcm91dGVQcm92aWRlclxuICAgICAgLndoZW4gJy9zaGVldC86bnVtYmVyJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3NoZWV0Q3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAnc2hlZXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdzaGVldC5odG1sJylcbiAgICAgIC53aGVuICcvZG9uZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdkb25lQ3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAnZG9uZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ2RvbmUuaHRtbCcpXG4gICAgICAud2hlbiAnL3BlcnNvbicsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdwZXJzb25DdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdwZXJzb24nXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdwZXJzb24uaHRtbCcpXG4gICAgICAud2hlbiAnL3Byb2JsZW0vOmlkJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3Byb2JsZW1DdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdwcm9ibGVtJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgncHJvYmxlbS5odG1sJylcbiAgICAgIC5vdGhlcndpc2VcbiAgICAgICAgcmVkaXJlY3RUbzogJy9zaGVldC9sYXRlc3QnXG5cbiAgLmNvbmZpZyAoJHJlc291cmNlUHJvdmlkZXIpIC0+XG4gICAgJHJlc291cmNlUHJvdmlkZXIuZGVmYXVsdHMuc3RyaXBUcmFpbGluZ1NsYXNoZXMgPSBmYWxzZVxuXG4gIC5jb25maWcgKCRsb2NhdGlvblByb3ZpZGVyKSAtPlxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSB0cnVlXG5cbiAgLmNvbmZpZyAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKSAtPlxuICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlXG5cbiAgLmNvbmZpZyAoJGh0dHBQcm92aWRlcikgLT5cbiAgICBjc3JmX3Rva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPWNzcmYtdG9rZW5dJykuY29udGVudFxuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQ1NSRlRva2VuJ10gPSBjc3JmX3Rva2VuXG4iLCJ1dGlscyA9IHJlcXVpcmUgJy4vdXRpbHMuY29mZmVlJ1xuXG5hcGlfcGF0aCA9IHV0aWxzLmFwaV9wYXRoXG5cbm1vZHVsZS5leHBvcnRzID0gKCRyZXNvdXJjZSkgLT5cbiAgJ1Byb2JsZW0nOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC8nKSwge2lkOiAnQGlkJ30sXG4gICAgICBzdGFycmVkOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvc3RhcnJlZC8nKVxuICAgICAgaGFzX3N0YXI6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9ibGVtcy86aWQvaGFzX3N0YXInKVxuICAgICAgICBwYXJhbXM6IHtpZDogJ0Bwcm9ibGVtSWQnfVxuICAgICAgc3RhcjpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC9zdGFyLycpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQGlkJ31cbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcbiAgICAgIHVuc3RhcjpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC91bnN0YXIvJylcbiAgICAgICAgcGFyYW1zOiB7aWQ6ICdAaWQnfVxuICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuXG4gICdBc3NpZ25tZW50JzpcbiAgICAkcmVzb3VyY2UgYXBpX3BhdGgoJy9hc3NpZ25tZW50cy86aWQnKSwge2lkOiAnQGlkJ30sXG4gICAgICBzb2x2ZWQ6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9hc3NpZ25tZW50cy9zb2x2ZWQnKVxuICAgICAgZG9uZTpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL2Fzc2lnbm1lbnRzLzppZC9kb25lLycpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQGlkJ31cbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcblxuICAnU2hlZXQnOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3NoZWV0cy86bnVtYmVyJyksIHtudW1iZXI6ICdAbnVtYmVyJ31cblxuICAnQ29tbWVudCc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvY29tbWVudHMvJyksIHt9XG5cbiIsImNsYXNzIFBlcnNvbkN0cmxcbiAgc3RhckRhdGE6IG51bGxcbiAgbmV4dDogbnVsbFxuICBzdGFyQ291bnQ6IDBcbiAgc3RhcnJlZFByb2JsZW1zOiBbXVxuICBkZWFjdGl2YXRlX3BhdGg6IERFQUNUSVZBVEVfUEFUSFxuICBsb2dvdXRfcGF0aDogTE9HT1VUX1BBVEhcbiAgY2hhbmdlX3Bhc3NfcGF0aDogQ0hBTkdFX1BBU1NfUEFUSFxuXG4gIHBhcnNlTmV4dDogKG5leHQpLT5cbiAgICBpZiBuZXh0XG4gICAgICBtYXRjaCA9IG5leHQubWF0Y2ggL3BhZ2U9KFxcZCspL1xuICAgICAgaWYgbWF0Y2gubGVuZ3RoID09IDJcbiAgICAgICAgQG5leHQgPSBwYXJzZUludChtYXRjaFsxXSlcbiAgICAgICAgcmV0dXJuXG4gICAgQG5leHQgPSBudWxsXG4gIFxuICBsb2FkX21vcmU6IC0+XG4gICAgQCRtb2RlbHMuUHJvYmxlbS5zdGFycmVkIHBhZ2U6IEBuZXh0LCAoZGF0YSkgPT5cbiAgICAgIGZvciBwcm9ibGVtIGluIGRhdGEucmVzdWx0c1xuICAgICAgICBAcGFyc2VOZXh0IGRhdGEubmV4dFxuICAgICAgICBAc3RhcnJlZFByb2JsZW1zLnB1c2ggcHJvYmxlbVxuXG4gIGNvbnN0cnVjdG9yOiAoQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuUHJvYmxlbS5zdGFycmVkIChkYXRhKSA9PlxuICAgICAgQHBhcnNlTmV4dCBkYXRhLm5leHRcbiAgICAgIEBzdGFyQ291bnQgPSBkYXRhLmNvdW50XG4gICAgICBAc3RhcnJlZFByb2JsZW1zID0gZGF0YS5yZXN1bHRzXG4gICAgICBAc3RhckRhdGEgPSBkYXRhXG5cbm1vZHVsZS5leHBvcnRzID0gUGVyc29uQ3RybFxuIiwiY2xhc3MgUHJvYmxlbUN0cmxcbiAgcHJvYmxlbURhdGE6IG51bGxcblxuICBkYXRlOiAnJ1xuICBwcm9ibGVtSWQ6ICcnXG4gIHByb2JsZW1OYW1lOiAnJ1xuICBwcm9ibGVtU3RhdGVtZW50OiAnJ1xuICB0YWdzOiBbXVxuICBoYXNfc3RhcjogZmFsc2VcbiAgY29tbWVudHM6IFtdXG4gIG5ld0NvbW1lbnRDb250ZW50OiAnJ1xuICBkaXNhYmxlQ29tbWVudDogZmFsc2VcblxuICBnZXRfZGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGUgPSBkYXRhLmRhdGVcbiAgICBAcHJvYmxlbUlkID0gZGF0YS5wcm9ibGVtSWRcbiAgICBAcHJvYmxlbU5hbWUgPSBkYXRhLnByb2JsZW1OYW1lXG4gICAgQHByb2JsZW1TdGF0ZW1lbnQgPSBkYXRhLnByb2JsZW1TdGF0ZW1lbnRcbiAgICBAdGFncyA9ICh0YWcudHJpbSgpIGZvciB0YWcgaW4gZGF0YS50YWdzLnNwbGl0KCcsJykpXG4gICAgQHByb2JsZW1EYXRhID0gZGF0YVxuICAgIEAkbW9kZWxzLlByb2JsZW0uaGFzX3N0YXIgaWQ6IEBwcm9ibGVtSWQsIChyZXMpID0+IEBoYXNfc3RhciA9IHJlcy5oYXNfc3RhclxuXG4gIGdldF9jb21tZW50X2RhdGE6IChkYXRhKSAtPlxuICAgIEBjb21tZW50cyA9IGRhdGFcblxuICBzdGFyOiAtPlxuICAgIEAkbW9kZWxzLlByb2JsZW0uc3RhciBpZDogQHByb2JsZW1JZCwgKHJlcykgPT5cbiAgICAgIEBoYXNfc3RhciA9IHRydWUgaWYgcmVzLnN0YXR1cyA9PSAnb2snXG5cbiAgdW5zdGFyOiAtPlxuICAgIEAkbW9kZWxzLlByb2JsZW0udW5zdGFyIGlkOiBAcHJvYmxlbUlkLCAocmVzKSA9PlxuICAgICAgQGhhc19zdGFyID0gZmFsc2UgaWYgcmVzLnN0YXR1cyA9PSAnb2snXG5cbiAgY29tbWVudEludmFsaWQ6IC0+XG4gICAgICByZXR1cm4gQG5ld0NvbW1lbnRDb250ZW50LnRyaW0oKS5sZW5ndGggPT0gMFxuXG4gIGNvbW1lbnQ6IC0+XG4gICAgICByZXR1cm4gaWYgQGNvbW1lbnRJbnZhbGlkKClcblxuICAgICAgY29udGVudCA9IEBuZXdDb21tZW50Q29udGVudC50cmltKClcbiAgICAgIEBkaXNhYmxlQ29tbWVudCA9IHRydWVcbiAgICAgIG5ld0NvbW1lbnQgPSBuZXcgQCRtb2RlbHMuQ29tbWVudFxuICAgICAgICBwcm9ibGVtOiBAcHJvYmxlbUlkXG4gICAgICAgIGNvbnRlbnQ6IGNvbnRlbnRcbiAgICAgIG5ld0NvbW1lbnQuJHNhdmUgKGRhdGEpID0+XG4gICAgICAgICAgQGNvbW1lbnRzLnVuc2hpZnQgZGF0YVxuICAgICAgICAgIEBuZXdDb21tZW50Q29udGVudCA9ICcnXG4gICAgICAgICAgQGRpc2FibGVDb21tZW50ID0gZmFsc2VcblxuICBjbGVhckNvbW1lbnQ6IC0+XG4gICAgQG5ld0NvbW1lbnRDb250ZW50ID0gJydcblxuICBjb25zdHJ1Y3RvcjogKCRyb3V0ZVBhcmFtcywgQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuUHJvYmxlbS5nZXQgaWQ6ICRyb3V0ZVBhcmFtcy5pZCwgKGRhdGEpID0+IEBnZXRfZGF0YShkYXRhKVxuICAgIEAkbW9kZWxzLkNvbW1lbnQucXVlcnkgcHJvYmxlbTogJHJvdXRlUGFyYW1zLmlkLCAoZGF0YSkgPT4gQGdldF9jb21tZW50X2RhdGEoZGF0YSlcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9ibGVtQ3RybFxuIiwidGVtcGxhdGVfcGF0aCA9IHJlcXVpcmUoJy4vdXRpbHMuY29mZmVlJykudGVtcGxhdGVfcGF0aFxuXG5pbml0U3dpcGVBY3Rpb24gPSAoc2NvcGUsIGVsZW1lbnQsICRzd2lwZSkgLT5cbiAgc2NvcGUuZG9uZV9hY3Rpb24gPSBzY29wZS5hY3Rpb25cbiAgc3dpcGVFbGVtZW50ID0gZWxlbWVudC5jaGlsZHJlbigpXG4gIG9yaWdpblggPSAwXG4gIHN3aXBlT2Zmc2V0ID0gMFxuICBjYW5jZWxpbmdPZmZzZXQgPSBmYWxzZVxuXG4gIGdldE9mZnNldCA9ICh4KSAtPlxuICAgIG9mZnNldCA9IHggLSBvcmlnaW5YXG4gICAgb2Zmc2V0ID0gMCBpZiBvZmZzZXQgPiAwXG4gICAgc3dpcGVPZmZzZXQgPSAxMDAgLSAxMDAgKiBNYXRoLnBvdygxLjIsIG9mZnNldC8xMClcblxuICB1cGRhdGVPZmZzZXQgPSAtPlxuICAgIHN3aXBlRWxlbWVudC5hdHRyICdzdHlsZScsIFwiLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgtI3tzd2lwZU9mZnNldH1weCwgMCk7dHJhbnNmb3JtOiB0cmFuc2xhdGUoLSN7c3dpcGVPZmZzZXR9cHgsIDApXCJcblxuICAkc3dpcGUuYmluZCBlbGVtZW50LFxuICAgIHN0YXJ0OiAob2JqKSAtPlxuICAgICAgaWYgbm90IHNjb3BlLnByb2JsZW0uZG9uZVxuICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdub3QtdG91Y2hpbmcnKVxuICAgICAgICBvcmlnaW5YID0gb2JqLnhcbiAgICBtb3ZlOiAob2JqKSAtPlxuICAgICAgaWYgbm90IHNjb3BlLnByb2JsZW0uZG9uZVxuICAgICAgICBnZXRPZmZzZXQob2JqLngpXG4gICAgICAgIHVwZGF0ZU9mZnNldChvYmoueClcbiAgICBlbmQ6IChvYmopIC0+XG4gICAgICBpZiBub3Qgc2NvcGUucHJvYmxlbS5kb25lXG4gICAgICAgIHNjb3BlLmFjdGlvbigpIGlmIHN3aXBlT2Zmc2V0ID4gODBcbiAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ25vdC10b3VjaGluZycpXG4gICAgICBzd2lwZU9mZnNldCA9IDBcbiAgICAgIHVwZGF0ZU9mZnNldCgpXG4gICAgY2FuY2VsOiAob2JqKSAtPlxuICAgICAgZWxlbWVudC5hZGRDbGFzcygnbm90LXRvdWNoaW5nJylcbiAgICAgIHN3aXBlT2Zmc2V0ID0gMFxuICAgICAgdXBkYXRlT2Zmc2V0KClcblxubW9kdWxlLmV4cG9ydHMgPSAoJGxvY2F0aW9uLCAkc3dpcGUpIC0+XG4gIHJlc3RyaWN0OiAnRSdcbiAgc2NvcGU6XG4gICAgdHlwZTogJz0nXG4gICAgcHJvYmxlbTogJz0nXG4gICAgYWN0aW9uOiAnJidcbiAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJy9wcm9ibGVtX2RpcmVjdGl2ZS5odG1sJylcblxuICBsaW5rOiAoc2NvcGUsIGVsZW1lbnQpIC0+XG4gICAgc2NvcGUuZGV0YWlsX2FjdGlvbj0gLT5cbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcHJvYmxlbS8nICsgc2NvcGUucHJvYmxlbS5vcmlnaW5Qcm9ibGVtKVxuXG4gICAgaWYgc2NvcGUudHlwZSA9PSAnc3RhcidcbiAgICAgIHNjb3BlLmlzX3N0YXIgPSB0cnVlXG4gICAgZWxzZVxuICAgICAgc2NvcGUuaXNfYXNzaWdubWVudCA9IHRydWVcblxuICAgIGNvbnNvbGUubG9nIHNjb3BlXG5cbiAgICBpZiBzY29wZS5hY3Rpb24gYW5kIChub3Qgc2NvcGUucHJvYmxlbS5kb25lKSBhbmQgc2NvcGUuaXNfYXNzaWdubWVudFxuICAgICAgaW5pdFN3aXBlQWN0aW9uKHNjb3BlLCBlbGVtZW50LCAkc3dpcGUpXG4iLCJjbGFzcyBzaGVldEN0cmxcbiAgc2hlZXREYXRhOiBudWxsXG4gIGRhdGU6ICcnXG4gIG51bWJlcjogMFxuICBwcm9ibGVtczogJydcbiAgaGFzX292ZXJkdWU6IGZhbHNlXG4gIGhhc19uZXc6IGZhbHNlXG4gIGhhc19yZXZpZXc6IGZhbHNlXG4gIGlzX2xhc3Q6IHRydWVcblxuICBnZXRfZGF0YTogKGRhdGEpIC0+XG4gICAgQGlzX2xhc3QgPSBkYXRhLmlzX2xhc3RcbiAgICBAZGF0ZSA9IGRhdGEuZGF0ZVxuICAgIEBudW1iZXIgPSBkYXRhLm51bWJlclxuICAgIEBwcm9ibGVtcyA9IGRhdGEucHJvYmxlbXNcbiAgICBAdGFncyA9IFtdXG4gICAgdGFnTWFwID0ge31cbiAgICBmb3IgcHJvYmxlbSBpbiBAcHJvYmxlbXNcbiAgICAgIHRhZ3MgPSBwcm9ibGVtLnRhZ3Muc3BsaXQoJywnKVxuICAgICAgZm9yIHRhZyBpbiB0YWdzXG4gICAgICAgIHRhZyA9IHRhZy50cmltKClcbiAgICAgICAgaWYgdGFnICBhbmQgKCF0YWdNYXBbdGFnXSlcbiAgICAgICAgICBAdGFncy5wdXNoIHRhZ1xuICAgICAgICAgIHRhZ01hcFt0YWddID0gdHJ1ZVxuICAgICAgc3dpdGNoIHByb2JsZW0udHlwZVxuICAgICAgICB3aGVuICdvdmVyZHVlJ1xuICAgICAgICAgIEBoYXNfb3ZlcmR1ZSA9IHRydWVcbiAgICAgICAgd2hlbiAnbmV3J1xuICAgICAgICAgIEBoYXNfbmV3ID0gdHJ1ZVxuICAgICAgICB3aGVuICdyZXZpZXcnXG4gICAgICAgICAgQGhhc19yZXZpZXcgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICBAc2hlZXREYXRhID0gZGF0YVxuXG4gIGRvbmU6IChwcm9ibGVtKSAtPlxuICAgIEAkbW9kZWxzLkFzc2lnbm1lbnQuZG9uZSBpZDogcHJvYmxlbS5pZCwgKGRhdGEpID0+XG4gICAgICBwcm9ibGVtLmRvbmUgPSB0cnVlXG4gXG4gIGNvbnN0cnVjdG9yOiAoJHJvdXRlUGFyYW1zLCBAJG1vZGVscykgLT5cbiAgICBAJG1vZGVscy5TaGVldC5nZXQgbnVtYmVyOiAkcm91dGVQYXJhbXMubnVtYmVyLCAoZGF0YSkgPT4gQGdldF9kYXRhKGRhdGEpXG4gICAgICBcblxubW9kdWxlLmV4cG9ydHMgPSBzaGVldEN0cmxcbiIsInRlbXBsYXRlX3BhdGggPSAocGF0aCkgLT5cbiAgcGF0aCA/PSAnJ1xuICByZXR1cm4gVEVNUExBVEVfUEFUSF9CQVNFICsgJy8nICsgcGF0aFxuXG5hcGlfcGF0aCA9IChwYXRoKSAtPlxuICByZXR1cm4gQVBJX1BBVEhfQkFTRSArIHBhdGhcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhcGlfcGF0aDogYXBpX3BhdGhcbiAgdGVtcGxhdGVfcGF0aDogdGVtcGxhdGVfcGF0aFxuIl19
