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
  return $routeProvider.when('/', {
    redirectTo: '/sheet/latest'
  }).when('/sheet/:number', {
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
    redirectTo: '/'
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
          return originX = obj.x;
        },
        move: function(obj) {
          getOffset(obj.x);
          return updateOffset(obj.x);
        },
        end: function(obj) {
          getOffset(obj.x);
          if (swipeOffset > 80) {
            scope.action();
          }
          swipeOffset = 0;
          return updateOffset(obj.x);
        },
        cancel: function(obj) {
          swipeOffset = 0;
          return updateOffset(obj.x);
        }
      });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2RvbmVDdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tb2RlbHMuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1DdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9zaGVldEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3V0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LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY2xhc3MgQXBwQ3RybFxuICBnbzogKHBhdGgpIC0+XG4gICAgQCRsb2NhdGlvbi5wYXRoKHBhdGgpXG5cbiAgY29uc3RydWN0b3I6IChAJGxvY2F0aW9uKSAtPlxuICAgIEB0aXRsZSA9ICdUQ0hlbHBlciB8IGFwcCdcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBDdHJsXG4iLCJjbGFzcyBEb25lQ3RybFxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAdGl0bGUgPSAnVENIZWxwZXIgfCBhcHAnXG5cbm1vZHVsZS5leHBvcnRzID0gRG9uZUN0cmxcbiIsInV0aWxzID0gcmVxdWlyZSAnLi91dGlscy5jb2ZmZWUnXG5cbmFwcEN0cmwgPSByZXF1aXJlICcuL2FwcEN0cmwuY29mZmVlJ1xuc2hlZXRDdHJsID0gcmVxdWlyZSAnLi9zaGVldEN0cmwuY29mZmVlJ1xuZG9uZUN0cmwgPSByZXF1aXJlICcuL2RvbmVDdHJsLmNvZmZlZSdcbnBlcnNvbkN0cmwgPSByZXF1aXJlICcuL3BlcnNvbkN0cmwuY29mZmVlJ1xucHJvYmxlbUN0cmwgPSByZXF1aXJlICcuL3Byb2JsZW1DdHJsLmNvZmZlZSdcblxucHJvYmxlbURpcmVjdGl2ZSA9IHJlcXVpcmUgJy4vcHJvYmxlbURpcmVjdGl2ZS5jb2ZmZWUnXG5cbm1vZGVscyA9IHJlcXVpcmUgJy4vbW9kZWxzLmNvZmZlZSdcblxudGVtcGxhdGVfcGF0aCA9IHV0aWxzLnRlbXBsYXRlX3BhdGhcblxuYW5ndWxhci5tb2R1bGUoJ3RjaEFwcCcsIFtcbiAgJ25nUm91dGUnLFxuICAnbmdUb3VjaCcsXG4gICduZ0FuaW1hdGUnLFxuICAnbmdTYW5pdGl6ZScsXG4gICduZ1Jlc291cmNlJyxcbiAgJ2FuZ3VsYXItbG9hZGluZy1iYXInLFxuXSlcbiAgLmNvbnRyb2xsZXIgJ2FwcEN0cmwnLCBhcHBDdHJsXG4gIC5jb250cm9sbGVyICdzaGVldEN0cmwnLCBzaGVldEN0cmxcbiAgLmNvbnRyb2xsZXIgJ2RvbmVDdHJsJywgZG9uZUN0cmxcbiAgLmNvbnRyb2xsZXIgJ3BlcnNvbkN0cmwnLCBwZXJzb25DdHJsXG4gIC5jb250cm9sbGVyICdwcm9ibGVtQ3RybCcsIHByb2JsZW1DdHJsXG5cbiAgLmRpcmVjdGl2ZSAncHJvYmxlbScsIHByb2JsZW1EaXJlY3RpdmVcblxuICAuZmFjdG9yeSAnJG1vZGVscycsIG1vZGVsc1xuXG4gIC5jb25maWcgKCRyb3V0ZVByb3ZpZGVyKSAtPlxuICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgICAud2hlbiAnLycsXG4gICAgICAgIHJlZGlyZWN0VG86ICcvc2hlZXQvbGF0ZXN0J1xuICAgICAgLndoZW4gJy9zaGVldC86bnVtYmVyJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3NoZWV0Q3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAnc2hlZXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdzaGVldC5odG1sJylcbiAgICAgIC53aGVuICcvZG9uZScsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdkb25lQ3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAnZG9uZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ2RvbmUuaHRtbCcpXG4gICAgICAud2hlbiAnL3BlcnNvbicsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdwZXJzb25DdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdwZXJzb24nXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdwZXJzb24uaHRtbCcpXG4gICAgICAud2hlbiAnL3Byb2JsZW0vOmlkJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3Byb2JsZW1DdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdwcm9ibGVtJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgncHJvYmxlbS5odG1sJylcbiAgICAgIC5vdGhlcndpc2VcbiAgICAgICAgcmVkaXJlY3RUbzogJy8nXG5cbiAgLmNvbmZpZyAoJHJlc291cmNlUHJvdmlkZXIpIC0+XG4gICAgJHJlc291cmNlUHJvdmlkZXIuZGVmYXVsdHMuc3RyaXBUcmFpbGluZ1NsYXNoZXMgPSBmYWxzZVxuXG4gIC5jb25maWcgKCRsb2NhdGlvblByb3ZpZGVyKSAtPlxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSB0cnVlXG5cbiAgLmNvbmZpZyAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKSAtPlxuICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlXG5cbiAgLmNvbmZpZyAoJGh0dHBQcm92aWRlcikgLT5cbiAgICBjc3JmX3Rva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPWNzcmYtdG9rZW5dJykuY29udGVudFxuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQ1NSRlRva2VuJ10gPSBjc3JmX3Rva2VuXG4iLCJ1dGlscyA9IHJlcXVpcmUgJy4vdXRpbHMuY29mZmVlJ1xuXG5hcGlfcGF0aCA9IHV0aWxzLmFwaV9wYXRoXG5cbm1vZHVsZS5leHBvcnRzID0gKCRyZXNvdXJjZSkgLT5cbiAgJ1Byb2JsZW0nOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC8nKSwge2lkOiAnQGlkJ30sXG4gICAgICBzdGFycmVkOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvc3RhcnJlZC8nKVxuXG4gICdBc3NpZ25tZW50JzpcbiAgICAkcmVzb3VyY2UgYXBpX3BhdGgoJy9hc3NpZ25tZW50cy86aWQnKSwge2lkOiAnQGlkJ30sXG4gICAgICBzb2x2ZWQ6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9hc3NpZ25tZW50cy9zb2x2ZWQnKVxuICAgICAgZG9uZTpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL2Fzc2lnbm1lbnRzLzppZC9kb25lLycpXG4gICAgICAgIHBhcmFtczoge2lkOiAnQGlkJ31cbiAgICAgICAgbWV0aG9kOiAnUE9TVCdcblxuICAnU2hlZXQnOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3NoZWV0cy86bnVtYmVyJyksIHtudW1iZXI6ICdAbnVtYmVyJ31cbiIsImNsYXNzIFBlcnNvbkN0cmxcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBlcnNvbkN0cmxcbiIsImNsYXNzIFByb2JsZW1DdHJsXG4gIHByb2JsZW1EYXRhOiBudWxsXG5cbiAgZGF0ZTogJydcbiAgcHJvYmxlbU5hbWU6ICcnXG4gIHByb2JsZW1TdGF0ZW1lbnQ6ICcnXG4gIHRhZ3M6IFtdXG5cbiAgZ2V0X2RhdGE6IChkYXRhKSAtPlxuICAgIEBkYXRlID0gZGF0YS5kYXRlXG4gICAgQHByb2JsZW1OYW1lID0gZGF0YS5wcm9ibGVtTmFtZVxuICAgIEBwcm9ibGVtU3RhdGVtZW50ID0gZGF0YS5wcm9ibGVtU3RhdGVtZW50XG4gICAgQHRhZ3MgPSAodGFnLnRyaW0oKSBmb3IgdGFnIGluIGRhdGEudGFncy5zcGxpdCgnLCcpKVxuICAgIGNvbnNvbGUubG9nIEB0YWdzXG4gICAgQHByb2JsZW1EYXRhID0gZGF0YVxuXG4gIGNvbnN0cnVjdG9yOiAoJHJvdXRlUGFyYW1zLCBAJG1vZGVscykgLT5cbiAgICBAJG1vZGVscy5Qcm9ibGVtLmdldCBpZDogJHJvdXRlUGFyYW1zLmlkLCAoZGF0YSkgPT4gQGdldF9kYXRhKGRhdGEpXG5cbm1vZHVsZS5leHBvcnRzID0gUHJvYmxlbUN0cmxcbiIsInRlbXBsYXRlX3BhdGggPSByZXF1aXJlKCcuL3V0aWxzLmNvZmZlZScpLnRlbXBsYXRlX3BhdGhcblxubW9kdWxlLmV4cG9ydHMgPSAoJGxvY2F0aW9uLCAkc3dpcGUpIC0+XG4gIHJlc3RyaWN0OiAnRSdcbiAgc2NvcGU6XG4gICAgdHlwZTogJz0nXG4gICAgcHJvYmxlbTogJz0nXG4gICAgYWN0aW9uOiAnJidcbiAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJy9wcm9ibGVtX2RpcmVjdGl2ZS5odG1sJylcbiAgbGluazogKHNjb3BlLCBlbGVtZW50KSAtPlxuICAgIHNjb3BlLmRldGFpbF9hY3Rpb249IC0+XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3Byb2JsZW0vJyArIHNjb3BlLnByb2JsZW0ub3JpZ2luUHJvYmxlbSlcblxuICAgIHN3aXBlRWxlbWVudCA9IGVsZW1lbnQuY2hpbGRyZW4oKVxuICAgIG9yaWdpblggPSAwXG4gICAgc3dpcGVPZmZzZXQgPSAwXG4gICAgY2FuY2VsaW5nT2Zmc2V0ID0gZmFsc2VcblxuICAgIGdldE9mZnNldCA9ICh4KSAtPlxuICAgICAgb2Zmc2V0ID0geCAtIG9yaWdpblhcbiAgICAgIG9mZnNldCA9IDAgaWYgb2Zmc2V0ID4gMFxuICAgICAgc3dpcGVPZmZzZXQgPSAxMDAgLSAxMDAgKiBNYXRoLnBvdygxLjIsIG9mZnNldC8xMClcblxuICAgIHVwZGF0ZU9mZnNldCA9IC0+XG4gICAgICBzd2lwZUVsZW1lbnQuYXR0ciAnc3R5bGUnLCBcIi13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoLSN7c3dpcGVPZmZzZXR9cHgsIDApO3RyYW5zZm9ybTogdHJhbnNsYXRlKC0je3N3aXBlT2Zmc2V0fXB4LCAwKVwiXG5cbiAgICAkc3dpcGUuYmluZCBlbGVtZW50LFxuICAgICAgc3RhcnQ6IChvYmopIC0+XG4gICAgICAgIG9yaWdpblggPSBvYmoueFxuICAgICAgbW92ZTogKG9iaikgLT5cbiAgICAgICAgZ2V0T2Zmc2V0KG9iai54KVxuICAgICAgICB1cGRhdGVPZmZzZXQob2JqLngpXG4gICAgICBlbmQ6IChvYmopIC0+XG4gICAgICAgIGdldE9mZnNldChvYmoueClcbiAgICAgICAgc2NvcGUuYWN0aW9uKCkgaWYgc3dpcGVPZmZzZXQgPiA4MFxuICAgICAgICBzd2lwZU9mZnNldCA9IDBcbiAgICAgICAgdXBkYXRlT2Zmc2V0KG9iai54KVxuICAgICAgY2FuY2VsOiAob2JqKSAtPlxuICAgICAgICBzd2lwZU9mZnNldCA9IDBcbiAgICAgICAgdXBkYXRlT2Zmc2V0KG9iai54KVxuIiwiY2xhc3Mgc2hlZXRDdHJsXG4gIHNoZWV0RGF0YTogbnVsbFxuICBkYXRlOiAnJ1xuICBudW1iZXI6IDBcbiAgcHJvYmxlbXM6ICcnXG4gIGhhc19vdmVyZHVlOiBmYWxzZVxuICBoYXNfbmV3OiBmYWxzZVxuICBoYXNfcmV2aWV3OiBmYWxzZVxuICBpc19sYXN0OiB0cnVlXG5cbiAgZ2V0X2RhdGE6IChkYXRhKSAtPlxuICAgIEBpc19sYXN0ID0gZGF0YS5pc19sYXN0XG4gICAgQGRhdGUgPSBkYXRhLmRhdGVcbiAgICBAbnVtYmVyID0gZGF0YS5udW1iZXJcbiAgICBAcHJvYmxlbXMgPSBkYXRhLnByb2JsZW1zXG4gICAgQHRhZ3MgPSBbXVxuICAgIHRhZ01hcCA9IHt9XG4gICAgZm9yIHByb2JsZW0gaW4gQHByb2JsZW1zXG4gICAgICB0YWdzID0gcHJvYmxlbS50YWdzLnNwbGl0KCcsJylcbiAgICAgIGZvciB0YWcgaW4gdGFnc1xuICAgICAgICB0YWcgPSB0YWcudHJpbSgpXG4gICAgICAgIGlmIHRhZyAgYW5kICghdGFnTWFwW3RhZ10pXG4gICAgICAgICAgQHRhZ3MucHVzaCB0YWdcbiAgICAgICAgICB0YWdNYXBbdGFnXSA9IHRydWVcbiAgICAgIHN3aXRjaCBwcm9ibGVtLnR5cGVcbiAgICAgICAgd2hlbiAnb3ZlcmR1ZSdcbiAgICAgICAgICBAaGFzX292ZXJkdWUgPSB0cnVlXG4gICAgICAgIHdoZW4gJ25ldydcbiAgICAgICAgICBAaGFzX25ldyA9IHRydWVcbiAgICAgICAgd2hlbiAncmV2aWV3J1xuICAgICAgICAgIEBoYXNfcmV2aWV3ID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgQHNoZWV0RGF0YSA9IGRhdGFcblxuICBkb25lOiAocHJvYmxlbSkgLT5cbiAgICBAJG1vZGVscy5Bc3NpZ25tZW50LmRvbmUgaWQ6IHByb2JsZW0uaWQsIChkYXRhKSA9PlxuICAgICAgcHJvYmxlbS5kb25lID0gdHJ1ZVxuIFxuICBjb25zdHJ1Y3RvcjogKCRyb3V0ZVBhcmFtcywgQCRtb2RlbHMpIC0+XG4gICAgQCRtb2RlbHMuU2hlZXQuZ2V0IG51bWJlcjogJHJvdXRlUGFyYW1zLm51bWJlciwgKGRhdGEpID0+IEBnZXRfZGF0YShkYXRhKVxuICAgICAgXG5cbm1vZHVsZS5leHBvcnRzID0gc2hlZXRDdHJsXG4iLCJ0ZW1wbGF0ZV9wYXRoID0gKHBhdGgpIC0+XG4gIHBhdGggPz0gJydcbiAgcmV0dXJuIFRFTVBMQVRFX1BBVEhfQkFTRSArICcvJyArIHBhdGhcblxuYXBpX3BhdGggPSAocGF0aCkgLT5cbiAgcmV0dXJuIEFQSV9QQVRIX0JBU0UgKyBwYXRoXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYXBpX3BhdGg6IGFwaV9wYXRoXG4gIHRlbXBsYXRlX3BhdGg6IHRlbXBsYXRlX3BhdGhcbiJdfQ==
