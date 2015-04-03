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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2RvbmVDdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tb2RlbHMuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1DdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9zaGVldEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3V0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VSxRQUFWO0FBQUEsRUFDQSxhQUFBLEVBQWUsYUFEZjtDQVJGLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgQXBwQ3RybFxuICBnbzogKHBhdGgpIC0+XG4gICAgQCRsb2NhdGlvbi5wYXRoKHBhdGgpXG5cbiAgY29uc3RydWN0b3I6IChAJGxvY2F0aW9uKSAtPlxuICAgIEB0aXRsZSA9ICdUQ0hlbHBlciB8IGFwcCdcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBDdHJsXG4iLCJjbGFzcyBEb25lQ3RybFxuICBkb25lRGF0YTogbnVsbFxuICBuZXh0OiBudWxsXG4gIGNvdW50OiAwXG4gIHByb2JsZW1zOiBbXVxuXG4gIHBhcnNlTmV4dDogKG5leHQpLT5cbiAgICBpZiBuZXh0XG4gICAgICBtYXRjaCA9IG5leHQubWF0Y2ggL3BhZ2U9KFxcZCspL1xuICAgICAgaWYgbWF0Y2gubGVuZ3RoID09IDJcbiAgICAgICAgQG5leHQgPSBwYXJzZUludChtYXRjaFsxXSlcbiAgICAgICAgcmV0dXJuXG4gICAgQG5leHQgPSBudWxsXG4gIFxuICBsb2FkX21vcmU6IC0+XG4gICAgQCRtb2RlbHMuQXNzaWdubWVudC5zb2x2ZWQgcGFnZTogQG5leHQsIChkYXRhKSA9PlxuICAgICAgZm9yIHByb2JsZW0gaW4gZGF0YS5yZXN1bHRzXG4gICAgICAgIEBwYXJzZU5leHQgZGF0YS5uZXh0XG4gICAgICAgIEBwcm9ibGVtcy5wdXNoIHByb2JsZW1cblxuICBjb25zdHJ1Y3RvcjogKEAkbW9kZWxzKSAtPlxuICAgIEAkbW9kZWxzLkFzc2lnbm1lbnQuc29sdmVkIChkYXRhKSA9PlxuICAgICAgQHBhcnNlTmV4dCBkYXRhLm5leHRcbiAgICAgIEBjb3VudCA9IGRhdGEuY291bnRcbiAgICAgIEBwcm9ibGVtcyA9IGRhdGEucmVzdWx0c1xuICAgICAgQGRvbmVEYXRhID0gZGF0YVxuXG5cbm1vZHVsZS5leHBvcnRzID0gRG9uZUN0cmxcbiIsInV0aWxzID0gcmVxdWlyZSAnLi91dGlscy5jb2ZmZWUnXG5cbmFwcEN0cmwgPSByZXF1aXJlICcuL2FwcEN0cmwuY29mZmVlJ1xuc2hlZXRDdHJsID0gcmVxdWlyZSAnLi9zaGVldEN0cmwuY29mZmVlJ1xuZG9uZUN0cmwgPSByZXF1aXJlICcuL2RvbmVDdHJsLmNvZmZlZSdcbnBlcnNvbkN0cmwgPSByZXF1aXJlICcuL3BlcnNvbkN0cmwuY29mZmVlJ1xucHJvYmxlbUN0cmwgPSByZXF1aXJlICcuL3Byb2JsZW1DdHJsLmNvZmZlZSdcblxucHJvYmxlbURpcmVjdGl2ZSA9IHJlcXVpcmUgJy4vcHJvYmxlbURpcmVjdGl2ZS5jb2ZmZWUnXG5cbm1vZGVscyA9IHJlcXVpcmUgJy4vbW9kZWxzLmNvZmZlZSdcblxudGVtcGxhdGVfcGF0aCA9IHV0aWxzLnRlbXBsYXRlX3BhdGhcblxuYW5ndWxhci5tb2R1bGUoJ3RjaEFwcCcsIFtcbiAgJ25nUm91dGUnLFxuICAnbmdUb3VjaCcsXG4gICduZ0FuaW1hdGUnLFxuICAnbmdTYW5pdGl6ZScsXG4gICduZ1Jlc291cmNlJyxcbiAgJ2FuZ3VsYXItbG9hZGluZy1iYXInLFxuXSlcbiAgLmNvbnRyb2xsZXIgJ2FwcEN0cmwnLCBhcHBDdHJsXG4gIC5jb250cm9sbGVyICdzaGVldEN0cmwnLCBzaGVldEN0cmxcbiAgLmNvbnRyb2xsZXIgJ2RvbmVDdHJsJywgZG9uZUN0cmxcbiAgLmNvbnRyb2xsZXIgJ3BlcnNvbkN0cmwnLCBwZXJzb25DdHJsXG4gIC5jb250cm9sbGVyICdwcm9ibGVtQ3RybCcsIHByb2JsZW1DdHJsXG5cbiAgLmRpcmVjdGl2ZSAncHJvYmxlbScsIHByb2JsZW1EaXJlY3RpdmVcblxuICAuZmFjdG9yeSAnJG1vZGVscycsIG1vZGVsc1xuXG4gIC5jb25maWcgKCRyb3V0ZVByb3ZpZGVyKSAtPlxuICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAud2hlbiAnL3NoZWV0LzpudW1iZXInLFxuICAgICAgICBjb250cm9sbGVyOiAnc2hlZXRDdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdzaGVldCdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3NoZWV0Lmh0bWwnKVxuICAgICAgLndoZW4gJy9kb25lJyxcbiAgICAgICAgY29udHJvbGxlcjogJ2RvbmVDdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdkb25lJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgnZG9uZS5odG1sJylcbiAgICAgIC53aGVuICcvcGVyc29uJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3BlcnNvbkN0cmwnXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3BlcnNvbidcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3BlcnNvbi5odG1sJylcbiAgICAgIC53aGVuICcvcHJvYmxlbS86aWQnLFxuICAgICAgICBjb250cm9sbGVyOiAncHJvYmxlbUN0cmwnXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3Byb2JsZW0nXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdwcm9ibGVtLmh0bWwnKVxuICAgICAgLm90aGVyd2lzZVxuICAgICAgICByZWRpcmVjdFRvOiAnL3NoZWV0L2xhdGVzdCdcblxuICAuY29uZmlnICgkcmVzb3VyY2VQcm92aWRlcikgLT5cbiAgICAkcmVzb3VyY2VQcm92aWRlci5kZWZhdWx0cy5zdHJpcFRyYWlsaW5nU2xhc2hlcyA9IGZhbHNlXG5cbiAgLmNvbmZpZyAoJGxvY2F0aW9uUHJvdmlkZXIpIC0+XG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlIHRydWVcblxuICAuY29uZmlnIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpIC0+XG4gICAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVTcGlubmVyID0gZmFsc2VcblxuICAuY29uZmlnICgkaHR0cFByb3ZpZGVyKSAtPlxuICAgIGNzcmZfdG9rZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9Y3NyZi10b2tlbl0nKS5jb250ZW50XG4gICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1DU1JGVG9rZW4nXSA9IGNzcmZfdG9rZW5cbiIsInV0aWxzID0gcmVxdWlyZSAnLi91dGlscy5jb2ZmZWUnXG5cbmFwaV9wYXRoID0gdXRpbHMuYXBpX3BhdGhcblxubW9kdWxlLmV4cG9ydHMgPSAoJHJlc291cmNlKSAtPlxuICAnUHJvYmxlbSc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkLycpLCB7aWQ6ICdAaWQnfSxcbiAgICAgIHN0YXJyZWQ6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9ibGVtcy9zdGFycmVkLycpXG4gICAgICBoYXNfc3RhcjpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC9oYXNfc3RhcicpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQHByb2JsZW1JZCd9XG4gICAgICBzdGFyOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkL3N0YXIvJylcbiAgICAgICAgcGFyYW1zOiB7aWQ6ICdAaWQnfVxuICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgdW5zdGFyOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkL3Vuc3Rhci8nKVxuICAgICAgICBwYXJhbXM6IHtpZDogJ0BpZCd9XG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXG5cbiAgJ0Fzc2lnbm1lbnQnOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL2Fzc2lnbm1lbnRzLzppZCcpLCB7aWQ6ICdAaWQnfSxcbiAgICAgIHNvbHZlZDpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL2Fzc2lnbm1lbnRzL3NvbHZlZCcpXG4gICAgICBkb25lOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvYXNzaWdubWVudHMvOmlkL2RvbmUvJylcbiAgICAgICAgcGFyYW1zOiB7aWQ6ICdAaWQnfVxuICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuXG4gICdTaGVldCc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvc2hlZXRzLzpudW1iZXInKSwge251bWJlcjogJ0BudW1iZXInfVxuIiwiY2xhc3MgUGVyc29uQ3RybFxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAdGl0bGUgPSAnVENIZWxwZXIgfCBhcHAnXG5cbm1vZHVsZS5leHBvcnRzID0gUGVyc29uQ3RybFxuIiwiY2xhc3MgUHJvYmxlbUN0cmxcbiAgcHJvYmxlbURhdGE6IG51bGxcblxuICBkYXRlOiAnJ1xuICBwcm9ibGVtSWQ6ICcnXG4gIHByb2JsZW1OYW1lOiAnJ1xuICBwcm9ibGVtU3RhdGVtZW50OiAnJ1xuICB0YWdzOiBbXVxuICBoYXNfc3RhcjogZmFsc2VcblxuICBnZXRfZGF0YTogKGRhdGEpIC0+XG4gICAgQGRhdGUgPSBkYXRhLmRhdGVcbiAgICBAcHJvYmxlbUlkID0gZGF0YS5wcm9ibGVtSWRcbiAgICBAcHJvYmxlbU5hbWUgPSBkYXRhLnByb2JsZW1OYW1lXG4gICAgQHByb2JsZW1TdGF0ZW1lbnQgPSBkYXRhLnByb2JsZW1TdGF0ZW1lbnRcbiAgICBAdGFncyA9ICh0YWcudHJpbSgpIGZvciB0YWcgaW4gZGF0YS50YWdzLnNwbGl0KCcsJykpXG4gICAgQHByb2JsZW1EYXRhID0gZGF0YVxuICAgIEAkbW9kZWxzLlByb2JsZW0uaGFzX3N0YXIgaWQ6IEBwcm9ibGVtSWQsIChyZXMpID0+IEBoYXNfc3RhciA9IHJlcy5oYXNfc3RhclxuXG4gIHN0YXI6IC0+XG4gICAgQCRtb2RlbHMuUHJvYmxlbS5zdGFyIGlkOiBAcHJvYmxlbUlkLCAocmVzKSA9PlxuICAgICAgQGhhc19zdGFyID0gdHJ1ZSBpZiByZXMuc3RhdHVzID09ICdvaydcblxuICB1bnN0YXI6IC0+XG4gICAgQCRtb2RlbHMuUHJvYmxlbS51bnN0YXIgaWQ6IEBwcm9ibGVtSWQsIChyZXMpID0+XG4gICAgICBAaGFzX3N0YXIgPSBmYWxzZSBpZiByZXMuc3RhdHVzID09ICdvaydcblxuICBjb25zdHJ1Y3RvcjogKCRyb3V0ZVBhcmFtcywgQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuUHJvYmxlbS5nZXQgaWQ6ICRyb3V0ZVBhcmFtcy5pZCwgKGRhdGEpID0+IEBnZXRfZGF0YShkYXRhKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2JsZW1DdHJsXG4iLCJ0ZW1wbGF0ZV9wYXRoID0gcmVxdWlyZSgnLi91dGlscy5jb2ZmZWUnKS50ZW1wbGF0ZV9wYXRoXG5cbm1vZHVsZS5leHBvcnRzID0gKCRsb2NhdGlvbiwgJHN3aXBlKSAtPlxuICByZXN0cmljdDogJ0UnXG4gIHNjb3BlOlxuICAgIHR5cGU6ICc9J1xuICAgIHByb2JsZW06ICc9J1xuICAgIGFjdGlvbjogJyYnXG4gIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCcvcHJvYmxlbV9kaXJlY3RpdmUuaHRtbCcpXG4gIGxpbms6IChzY29wZSwgZWxlbWVudCkgLT5cbiAgICBzY29wZS5kZXRhaWxfYWN0aW9uPSAtPlxuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wcm9ibGVtLycgKyBzY29wZS5wcm9ibGVtLm9yaWdpblByb2JsZW0pXG5cbiAgICBpZiBzY29wZS5hY3Rpb24gYW5kIG5vdCBzY29wZS5wcm9ibGVtLmRvbmVcbiAgICAgIHNjb3BlLmRvbmVfYWN0aW9uID0gc2NvcGUuYWN0aW9uXG4gICAgICBzd2lwZUVsZW1lbnQgPSBlbGVtZW50LmNoaWxkcmVuKClcbiAgICAgIG9yaWdpblggPSAwXG4gICAgICBzd2lwZU9mZnNldCA9IDBcbiAgICAgIGNhbmNlbGluZ09mZnNldCA9IGZhbHNlXG5cbiAgICAgIGdldE9mZnNldCA9ICh4KSAtPlxuICAgICAgICBvZmZzZXQgPSB4IC0gb3JpZ2luWFxuICAgICAgICBvZmZzZXQgPSAwIGlmIG9mZnNldCA+IDBcbiAgICAgICAgc3dpcGVPZmZzZXQgPSAxMDAgLSAxMDAgKiBNYXRoLnBvdygxLjIsIG9mZnNldC8xMClcblxuICAgICAgdXBkYXRlT2Zmc2V0ID0gLT5cbiAgICAgICAgc3dpcGVFbGVtZW50LmF0dHIgJ3N0eWxlJywgXCItd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlKC0je3N3aXBlT2Zmc2V0fXB4LCAwKTt0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtI3tzd2lwZU9mZnNldH1weCwgMClcIlxuXG4gICAgICAkc3dpcGUuYmluZCBlbGVtZW50LFxuICAgICAgICBzdGFydDogKG9iaikgLT5cbiAgICAgICAgICBpZiBub3Qgc2NvcGUucHJvYmxlbS5kb25lXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUNsYXNzKCdub3QtdG91Y2hpbmcnKVxuICAgICAgICAgICAgb3JpZ2luWCA9IG9iai54XG4gICAgICAgIG1vdmU6IChvYmopIC0+XG4gICAgICAgICAgaWYgbm90IHNjb3BlLnByb2JsZW0uZG9uZVxuICAgICAgICAgICAgZ2V0T2Zmc2V0KG9iai54KVxuICAgICAgICAgICAgdXBkYXRlT2Zmc2V0KG9iai54KVxuICAgICAgICBlbmQ6IChvYmopIC0+XG4gICAgICAgICAgaWYgbm90IHNjb3BlLnByb2JsZW0uZG9uZVxuICAgICAgICAgICAgc2NvcGUuYWN0aW9uKCkgaWYgc3dpcGVPZmZzZXQgPiA4MFxuICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ25vdC10b3VjaGluZycpXG4gICAgICAgICAgc3dpcGVPZmZzZXQgPSAwXG4gICAgICAgICAgdXBkYXRlT2Zmc2V0KClcbiAgICAgICAgY2FuY2VsOiAob2JqKSAtPlxuICAgICAgICAgIGVsZW1lbnQuYWRkQ2xhc3MoJ25vdC10b3VjaGluZycpXG4gICAgICAgICAgc3dpcGVPZmZzZXQgPSAwXG4gICAgICAgICAgdXBkYXRlT2Zmc2V0KClcbiIsImNsYXNzIHNoZWV0Q3RybFxuICBzaGVldERhdGE6IG51bGxcbiAgZGF0ZTogJydcbiAgbnVtYmVyOiAwXG4gIHByb2JsZW1zOiAnJ1xuICBoYXNfb3ZlcmR1ZTogZmFsc2VcbiAgaGFzX25ldzogZmFsc2VcbiAgaGFzX3JldmlldzogZmFsc2VcbiAgaXNfbGFzdDogdHJ1ZVxuXG4gIGdldF9kYXRhOiAoZGF0YSkgLT5cbiAgICBAaXNfbGFzdCA9IGRhdGEuaXNfbGFzdFxuICAgIEBkYXRlID0gZGF0YS5kYXRlXG4gICAgQG51bWJlciA9IGRhdGEubnVtYmVyXG4gICAgQHByb2JsZW1zID0gZGF0YS5wcm9ibGVtc1xuICAgIEB0YWdzID0gW11cbiAgICB0YWdNYXAgPSB7fVxuICAgIGZvciBwcm9ibGVtIGluIEBwcm9ibGVtc1xuICAgICAgdGFncyA9IHByb2JsZW0udGFncy5zcGxpdCgnLCcpXG4gICAgICBmb3IgdGFnIGluIHRhZ3NcbiAgICAgICAgdGFnID0gdGFnLnRyaW0oKVxuICAgICAgICBpZiB0YWcgIGFuZCAoIXRhZ01hcFt0YWddKVxuICAgICAgICAgIEB0YWdzLnB1c2ggdGFnXG4gICAgICAgICAgdGFnTWFwW3RhZ10gPSB0cnVlXG4gICAgICBzd2l0Y2ggcHJvYmxlbS50eXBlXG4gICAgICAgIHdoZW4gJ292ZXJkdWUnXG4gICAgICAgICAgQGhhc19vdmVyZHVlID0gdHJ1ZVxuICAgICAgICB3aGVuICduZXcnXG4gICAgICAgICAgQGhhc19uZXcgPSB0cnVlXG4gICAgICAgIHdoZW4gJ3JldmlldydcbiAgICAgICAgICBAaGFzX3JldmlldyA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgIEBzaGVldERhdGEgPSBkYXRhXG5cbiAgZG9uZTogKHByb2JsZW0pIC0+XG4gICAgQCRtb2RlbHMuQXNzaWdubWVudC5kb25lIGlkOiBwcm9ibGVtLmlkLCAoZGF0YSkgPT5cbiAgICAgIHByb2JsZW0uZG9uZSA9IHRydWVcbiBcbiAgY29uc3RydWN0b3I6ICgkcm91dGVQYXJhbXMsIEAkbW9kZWxzKSAtPlxuICAgIEAkbW9kZWxzLlNoZWV0LmdldCBudW1iZXI6ICRyb3V0ZVBhcmFtcy5udW1iZXIsIChkYXRhKSA9PiBAZ2V0X2RhdGEoZGF0YSlcbiAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9IHNoZWV0Q3RybFxuIiwidGVtcGxhdGVfcGF0aCA9IChwYXRoKSAtPlxuICBwYXRoID89ICcnXG4gIHJldHVybiBURU1QTEFURV9QQVRIX0JBU0UgKyAnLycgKyBwYXRoXG5cbmFwaV9wYXRoID0gKHBhdGgpIC0+XG4gIHJldHVybiBBUElfUEFUSF9CQVNFICsgcGF0aFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFwaV9wYXRoOiBhcGlfcGF0aFxuICB0ZW1wbGF0ZV9wYXRoOiB0ZW1wbGF0ZV9wYXRoXG4iXX0=
