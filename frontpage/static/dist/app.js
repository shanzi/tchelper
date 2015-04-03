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
var SearchCtrl;

SearchCtrl = (function() {
  function SearchCtrl() {
    this.title = 'TCHelper | app';
  }

  return SearchCtrl;

})();

module.exports = SearchCtrl;



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/main.coffee":[function(require,module,exports){
var appCtrl, doneCtrl, models, personCtrl, problemDirective, sheetCtrl, template_path, utils;

utils = require('./utils.coffee');

appCtrl = require('./appCtrl.coffee');

sheetCtrl = require('./sheetCtrl.coffee');

doneCtrl = require('./doneCtrl.coffee');

personCtrl = require('./personCtrl.coffee');

problemDirective = require('./problemDirective.coffee');

models = require('./models.coffee');

template_path = utils.template_path;

angular.module('tchApp', ['ngRoute', 'ngTouch', 'ngAnimate', 'ngResource', 'angular-loading-bar']).controller('appCtrl', appCtrl).controller('sheetCtrl', sheetCtrl).directive('problem', problemDirective).factory('$models', models).config(function($routeProvider) {
  return $routeProvider.when('/', {
    redirectTo: '/sheet/latest'
  }).when('/sheet/:number', {
    controller: 'sheetCtrl',
    controllerAs: 'sheet',
    templateUrl: template_path('sheet.html')
  }).when('/done', {
    controller: doneCtrl,
    controllerAs: 'done',
    templateUrl: template_path('done.html')
  }).when('/person', {
    controller: personCtrl,
    controllerAs: 'person',
    templateUrl: template_path('person.html')
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



},{"./appCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/appCtrl.coffee","./doneCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/doneCtrl.coffee","./models.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/models.coffee","./personCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/personCtrl.coffee","./problemDirective.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/problemDirective.coffee","./sheetCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/sheetCtrl.coffee","./utils.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/utils.coffee"}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/models.coffee":[function(require,module,exports){
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
    templateUrl: template_path('/problem.html'),
    link: function(scope, element) {
      var cancelingOffset, getOffset, originX, swipeElement, swipeOffset, updateOffset;
      scope.detail_action = function() {
        return $location.path('/problem/' + scope.problemId);
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
    var i, j, len, len1, problem, ref, results, tag, tagMap, tags;
    this.sheetData = data;
    this.is_last = data.is_last;
    this.date = data.date;
    this.number = data.number;
    this.problems = data.problems;
    this.tags = [];
    tagMap = {};
    ref = this.problems;
    results = [];
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
          results.push(this.has_overdue = true);
          break;
        case 'new':
          results.push(this.has_new = true);
          break;
        case 'review':
          results.push(this.has_review = true);
          break;
      }
    }
    return results;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2RvbmVDdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tb2RlbHMuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3Byb2JsZW1EaXJlY3RpdmUuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3NoZWV0Q3RybC5jb2ZmZWUiLCIvVXNlcnMvQ2hhc2VfWmhhbmcvY29kZXMvcHJvamVjdHMvdGNoZWxwZXIvZnJvbnRwYWdlL3N0YXRpYy9jb2ZmZWUvdXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxPQUFBOztBQUFBO0FBQ0Usb0JBQUEsRUFBQSxHQUFJLFNBQUMs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LEVBQVY7TUFBQSxFQUFBO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRCxDQUFBLENBRFc7RUFBQSxDQXJDYjs7bUJBQUE7O0lBREYsQ0FBQTs7QUFBQSxNQTBDTSxDQUFDLE9BQVAsR0FBaUIsU0ExQ2pCLENBQUE7Ozs7O0FDQUEsSUFBQSx1QkFBQTs7QUFBQSxhQUFBLEdBQWdCLFNBQUMsSUFBRCxHQUFBOztJQUNkLE9BQVE7R0FBUjtBQUNBLFNBQU8sa0JBQUEsR0FBcUIsR0FBckIsR0FBMkIsSUFBbEMsQ0FGYztBQUFBLENBQWhCLENBQUE7O0FBQUEsUUFJQSxHQUFXLFNBQUMsSUFBRCxHQUFBO0FBQ1QsU0FBTyxhQUFBLEdBQWdCLElBQXZCLENBRFM7QUFBQSxDQUpYLENBQUE7O0FBQUEsTUFPTSxDQUFDLE9BQVAsR0FDRTtBQUFBLEVBQUEsUUFBQSxFQUFVLFFBQVY7QUFBQSxFQUNBLGFBQUEsRUFBZSxhQURmO0NBUkYsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBBcHBDdHJsXG4gIGdvOiAocGF0aCkgLT5cbiAgICBAJGxvY2F0aW9uLnBhdGgocGF0aClcblxuICBjb25zdHJ1Y3RvcjogKEAkbG9jYXRpb24pIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEN0cmxcbiIsImNsYXNzIFNlYXJjaEN0cmxcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXJjaEN0cmxcbiIsInV0aWxzID0gcmVxdWlyZSAnLi91dGlscy5jb2ZmZWUnXG5cbmFwcEN0cmwgPSByZXF1aXJlICcuL2FwcEN0cmwuY29mZmVlJ1xuc2hlZXRDdHJsID0gcmVxdWlyZSAnLi9zaGVldEN0cmwuY29mZmVlJ1xuZG9uZUN0cmwgPSByZXF1aXJlICcuL2RvbmVDdHJsLmNvZmZlZSdcbnBlcnNvbkN0cmwgPSByZXF1aXJlICcuL3BlcnNvbkN0cmwuY29mZmVlJ1xuXG5wcm9ibGVtRGlyZWN0aXZlID0gcmVxdWlyZSAnLi9wcm9ibGVtRGlyZWN0aXZlLmNvZmZlZSdcblxubW9kZWxzID0gcmVxdWlyZSAnLi9tb2RlbHMuY29mZmVlJ1xuXG50ZW1wbGF0ZV9wYXRoID0gdXRpbHMudGVtcGxhdGVfcGF0aFxuXG5hbmd1bGFyLm1vZHVsZSgndGNoQXBwJywgW1xuICAnbmdSb3V0ZScsXG4gICduZ1RvdWNoJyxcbiAgJ25nQW5pbWF0ZScsXG4gICduZ1Jlc291cmNlJyxcbiAgJ2FuZ3VsYXItbG9hZGluZy1iYXInLFxuXSlcbiAgLmNvbnRyb2xsZXIgJ2FwcEN0cmwnLCBhcHBDdHJsXG4gIC5jb250cm9sbGVyICdzaGVldEN0cmwnLCBzaGVldEN0cmxcblxuICAuZGlyZWN0aXZlICdwcm9ibGVtJywgcHJvYmxlbURpcmVjdGl2ZVxuXG4gIC5mYWN0b3J5ICckbW9kZWxzJywgbW9kZWxzXG5cbiAgLmNvbmZpZyAoJHJvdXRlUHJvdmlkZXIpIC0+XG4gICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgIC53aGVuICcvJyxcbiAgICAgICAgcmVkaXJlY3RUbzogJy9zaGVldC9sYXRlc3QnXG4gICAgICAud2hlbiAnL3NoZWV0LzpudW1iZXInLFxuICAgICAgICBjb250cm9sbGVyOiAnc2hlZXRDdHJsJ1xuICAgICAgICBjb250cm9sbGVyQXM6ICdzaGVldCdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3NoZWV0Lmh0bWwnKVxuICAgICAgLndoZW4gJy9kb25lJyxcbiAgICAgICAgY29udHJvbGxlcjogZG9uZUN0cmxcbiAgICAgICAgY29udHJvbGxlckFzOiAnZG9uZSdcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ2RvbmUuaHRtbCcpXG4gICAgICAud2hlbiAnL3BlcnNvbicsXG4gICAgICAgIGNvbnRyb2xsZXI6IHBlcnNvbkN0cmxcbiAgICAgICAgY29udHJvbGxlckFzOiAncGVyc29uJ1xuICAgICAgICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgncGVyc29uLmh0bWwnKVxuICAgICAgLm90aGVyd2lzZVxuICAgICAgICByZWRpcmVjdFRvOiAnLydcblxuICAuY29uZmlnICgkcmVzb3VyY2VQcm92aWRlcikgLT5cbiAgICAkcmVzb3VyY2VQcm92aWRlci5kZWZhdWx0cy5zdHJpcFRyYWlsaW5nU2xhc2hlcyA9IGZhbHNlXG5cbiAgLmNvbmZpZyAoJGxvY2F0aW9uUHJvdmlkZXIpIC0+XG4gICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlIHRydWVcblxuICAuY29uZmlnIChjZnBMb2FkaW5nQmFyUHJvdmlkZXIpIC0+XG4gICAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLmluY2x1ZGVTcGlubmVyID0gZmFsc2VcblxuICAuY29uZmlnICgkaHR0cFByb3ZpZGVyKSAtPlxuICAgIGNzcmZfdG9rZW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9Y3NyZi10b2tlbl0nKS5jb250ZW50XG4gICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1DU1JGVG9rZW4nXSA9IGNzcmZfdG9rZW5cbiIsInV0aWxzID0gcmVxdWlyZSAnLi91dGlscy5jb2ZmZWUnXG5cbmFwaV9wYXRoID0gdXRpbHMuYXBpX3BhdGhcblxubW9kdWxlLmV4cG9ydHMgPSAoJHJlc291cmNlKSAtPlxuICAnUHJvYmxlbSc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvcHJvYmxlbXMvOmlkLycpLCB7aWQ6ICdAaWQnfSxcbiAgICAgIHN0YXJyZWQ6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9wcm9ibGVtcy9zdGFycmVkLycpXG5cbiAgJ0Fzc2lnbm1lbnQnOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL2Fzc2lnbm1lbnRzLzppZCcpLCB7aWQ6ICdAaWQnfSxcbiAgICAgIHNvbHZlZDpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL2Fzc2lnbm1lbnRzL3NvbHZlZCcpXG4gICAgICBkb25lOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvYXNzaWdubWVudHMvOmlkL2RvbmUvJylcbiAgICAgICAgcGFyYW1zOiB7aWQ6ICdAaWQnfVxuICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuXG4gICdTaGVldCc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvc2hlZXRzLzpudW1iZXInKSwge251bWJlcjogJ0BudW1iZXInfVxuIiwiY2xhc3MgUGVyc29uQ3RybFxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAdGl0bGUgPSAnVENIZWxwZXIgfCBhcHAnXG5cbm1vZHVsZS5leHBvcnRzID0gUGVyc29uQ3RybFxuIiwidGVtcGxhdGVfcGF0aCA9IHJlcXVpcmUoJy4vdXRpbHMuY29mZmVlJykudGVtcGxhdGVfcGF0aFxuXG5tb2R1bGUuZXhwb3J0cyA9ICgkbG9jYXRpb24sICRzd2lwZSkgLT5cbiAgcmVzdHJpY3Q6ICdFJ1xuICBzY29wZTpcbiAgICB0eXBlOiAnPSdcbiAgICBwcm9ibGVtOiAnPSdcbiAgICBhY3Rpb246ICcmJ1xuICB0ZW1wbGF0ZVVybDogdGVtcGxhdGVfcGF0aCgnL3Byb2JsZW0uaHRtbCcpXG4gIGxpbms6IChzY29wZSwgZWxlbWVudCkgLT5cbiAgICBzY29wZS5kZXRhaWxfYWN0aW9uPSAtPlxuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wcm9ibGVtLycgKyBzY29wZS5wcm9ibGVtSWQpXG5cbiAgICBzd2lwZUVsZW1lbnQgPSBlbGVtZW50LmNoaWxkcmVuKClcbiAgICBvcmlnaW5YID0gMFxuICAgIHN3aXBlT2Zmc2V0ID0gMFxuICAgIGNhbmNlbGluZ09mZnNldCA9IGZhbHNlXG5cbiAgICBnZXRPZmZzZXQgPSAoeCkgLT5cbiAgICAgIG9mZnNldCA9IHggLSBvcmlnaW5YXG4gICAgICBvZmZzZXQgPSAwIGlmIG9mZnNldCA+IDBcbiAgICAgIHN3aXBlT2Zmc2V0ID0gMTAwIC0gMTAwICogTWF0aC5wb3coMS4yLCBvZmZzZXQvMTApXG5cbiAgICB1cGRhdGVPZmZzZXQgPSAtPlxuICAgICAgc3dpcGVFbGVtZW50LmF0dHIgJ3N0eWxlJywgXCItd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlKC0je3N3aXBlT2Zmc2V0fXB4LCAwKTt0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtI3tzd2lwZU9mZnNldH1weCwgMClcIlxuXG4gICAgJHN3aXBlLmJpbmQgZWxlbWVudCxcbiAgICAgIHN0YXJ0OiAob2JqKSAtPlxuICAgICAgICBvcmlnaW5YID0gb2JqLnhcbiAgICAgIG1vdmU6IChvYmopIC0+XG4gICAgICAgIGdldE9mZnNldChvYmoueClcbiAgICAgICAgdXBkYXRlT2Zmc2V0KG9iai54KVxuICAgICAgZW5kOiAob2JqKSAtPlxuICAgICAgICBnZXRPZmZzZXQob2JqLngpXG4gICAgICAgIHNjb3BlLmFjdGlvbigpIGlmIHN3aXBlT2Zmc2V0ID4gODBcbiAgICAgICAgc3dpcGVPZmZzZXQgPSAwXG4gICAgICAgIHVwZGF0ZU9mZnNldChvYmoueClcbiAgICAgIGNhbmNlbDogKG9iaikgLT5cbiAgICAgICAgc3dpcGVPZmZzZXQgPSAwXG4gICAgICAgIHVwZGF0ZU9mZnNldChvYmoueClcbiIsImNsYXNzIHNoZWV0Q3RybFxuICBzaGVldERhdGE6IG51bGxcbiAgZGF0ZTogJydcbiAgbnVtYmVyOiAwXG4gIHByb2JsZW1zOiAnJ1xuICBoYXNfb3ZlcmR1ZTogZmFsc2VcbiAgaGFzX25ldzogZmFsc2VcbiAgaGFzX3JldmlldzogZmFsc2VcbiAgaXNfbGFzdDogdHJ1ZVxuXG4gIGdldF9kYXRhOiAoZGF0YSkgLT5cbiAgICBAc2hlZXREYXRhID0gZGF0YVxuICAgIEBpc19sYXN0ID0gZGF0YS5pc19sYXN0XG4gICAgQGRhdGUgPSBkYXRhLmRhdGVcbiAgICBAbnVtYmVyID0gZGF0YS5udW1iZXJcbiAgICBAcHJvYmxlbXMgPSBkYXRhLnByb2JsZW1zXG4gICAgQHRhZ3MgPSBbXVxuICAgIHRhZ01hcCA9IHt9XG4gICAgZm9yIHByb2JsZW0gaW4gQHByb2JsZW1zXG4gICAgICB0YWdzID0gcHJvYmxlbS50YWdzLnNwbGl0KCcsJylcbiAgICAgIGZvciB0YWcgaW4gdGFnc1xuICAgICAgICB0YWcgPSB0YWcudHJpbSgpXG4gICAgICAgIGlmIHRhZyAgYW5kICghdGFnTWFwW3RhZ10pXG4gICAgICAgICAgQHRhZ3MucHVzaCB0YWdcbiAgICAgICAgICB0YWdNYXBbdGFnXSA9IHRydWVcbiAgICAgIHN3aXRjaCBwcm9ibGVtLnR5cGVcbiAgICAgICAgd2hlbiAnb3ZlcmR1ZSdcbiAgICAgICAgICBAaGFzX292ZXJkdWUgPSB0cnVlXG4gICAgICAgIHdoZW4gJ25ldydcbiAgICAgICAgICBAaGFzX25ldyA9IHRydWVcbiAgICAgICAgd2hlbiAncmV2aWV3J1xuICAgICAgICAgIEBoYXNfcmV2aWV3ID0gdHJ1ZVxuICAgICAgICBlbHNlXG5cbiAgZG9uZTogKHByb2JsZW0pIC0+XG4gICAgQCRtb2RlbHMuQXNzaWdubWVudC5kb25lIGlkOiBwcm9ibGVtLmlkLCAoZGF0YSkgPT5cbiAgICAgIHByb2JsZW0uZG9uZSA9IHRydWVcbiBcbiAgY29uc3RydWN0b3I6ICgkcm91dGVQYXJhbXMsIEAkbW9kZWxzKSAtPlxuICAgIEAkbW9kZWxzLlNoZWV0LmdldCBudW1iZXI6ICRyb3V0ZVBhcmFtcy5udW1iZXIsIChkYXRhKSA9PiBAZ2V0X2RhdGEoZGF0YSlcbiAgICAgIFxuXG5tb2R1bGUuZXhwb3J0cyA9IHNoZWV0Q3RybFxuIiwidGVtcGxhdGVfcGF0aCA9IChwYXRoKSAtPlxuICBwYXRoID89ICcnXG4gIHJldHVybiBURU1QTEFURV9QQVRIX0JBU0UgKyAnLycgKyBwYXRoXG5cbmFwaV9wYXRoID0gKHBhdGgpIC0+XG4gIHJldHVybiBBUElfUEFUSF9CQVNFICsgcGF0aFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFwaV9wYXRoOiBhcGlfcGF0aFxuICB0ZW1wbGF0ZV9wYXRoOiB0ZW1wbGF0ZV9wYXRoXG4iXX0=
