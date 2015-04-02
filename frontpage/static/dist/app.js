(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/appCtrl.coffee":[function(require,module,exports){
var AppCtrl;

AppCtrl = (function() {
  function AppCtrl() {
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
var appCtrl, doneCtrl, models, personCtrl, sheetCtrl, template_path;

appCtrl = require('./appCtrl.coffee');

sheetCtrl = require('./sheetCtrl.coffee');

doneCtrl = require('./doneCtrl.coffee');

personCtrl = require('./personCtrl.coffee');

models = require('./models.coffee');

template_path = function(path) {
  if (path == null) {
    path = '';
  }
  return TEMPLATE_PATH_BASE + '/' + path;
};

angular.module('tchApp', ['ngRoute', 'ngTouch', 'ngAnimate', 'ngResource', 'angular-loading-bar']).controller('appCtrl', appCtrl).controller('sheetCtrl', sheetCtrl).factory('$models', models).config(function($routeProvider) {
  return $routeProvider.when('/', {
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
  return csrf_token = document.querySelector('meta[name=csrf-token]').content;
});



},{"./appCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/appCtrl.coffee","./doneCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/doneCtrl.coffee","./models.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/models.coffee","./personCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/personCtrl.coffee","./sheetCtrl.coffee":"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/sheetCtrl.coffee"}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/models.coffee":[function(require,module,exports){
var api_path;

api_path = function(path) {
  return API_PATH_BASE + path;
};

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
      }
    }),
    'Sheet': $resource(api_path('/sheets/:number'), {
      number: '@number'
    }, {
      latest: {
        url: api_path('/sheets/latest')
      }
    })
  };
};



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/personCtrl.coffee":[function(require,module,exports){
var PersonCtrl;

PersonCtrl = (function() {
  function PersonCtrl() {
    this.title = 'TCHelper | app';
  }

  return PersonCtrl;

})();

module.exports = PersonCtrl;



},{}],"/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/sheetCtrl.coffee":[function(require,module,exports){
var sheetCtrl;

sheetCtrl = (function() {
  sheetCtrl.prototype.sheetData = null;

  sheetCtrl.prototype.date = '';

  sheetCtrl.prototype.number = 0;

  sheetCtrl.prototype.problems = '';

  sheetCtrl.prototype.has_overdue = false;

  sheetCtrl.prototype.has_new = false;

  sheetCtrl.prototype.has_review = false;

  function sheetCtrl($scope, $models) {
    $models.Sheet.latest((function(_this) {
      return function(data) {
        var i, j, len, len1, problem, ref, results, tag, tagMap, tags;
        _this.sheetData = data;
        _this.date = data.date;
        _this.number = data.number;
        _this.problems = data.problems;
        _this.tags = [];
        tagMap = {};
        ref = _this.problems;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          problem = ref[i];
          tags = problem.tags.split(',');
          for (j = 0, len1 = tags.length; j < len1; j++) {
            tag = tags[j];
            tag = tag.trim();
            if (tag && (!tagMap[tag])) {
              _this.tags.push(tag);
              tagMap[tag] = true;
            }
          }
          switch (problem.type) {
            case 'overdue':
              results.push(_this.has_overdue = true);
              break;
            case 'new':
              results.push(_this.has_new = true);
              break;
            case 'review':
              results.push(_this.has_review = true);
              break;
          }
        }
        return results;
      };
    })(this));
  }

  return sheetCtrl;

})();

module.exports = sheetCtrl;



},{}]},{},["/Users/Chase_Zhang/codes/projects/tchelper/frontpage/static/coffee/main.coffee"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy5udm0vdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2FwcEN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL2RvbmVDdHJsLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tYWluLmNvZmZlZSIsIi9Vc2Vycy9DaGFzZV9aaGFuZy9jb2Rlcy9wcm9qZWN0cy90Y2hlbHBlci9mcm9udHBhZ2Uvc3RhdGljL2NvZmZlZS9tb2RlbHMuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3BlcnNvbkN0cmwuY29mZmVlIiwiL1VzZXJzL0NoYXNlX1poYW5nL2NvZGVzL3Byb2plY3RzL3RjaGVscGVyL2Zyb250cGFnZS9zdGF0aWMvY29mZmVlL3NoZWV0Q3RybC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLE9BQUE7O0FBQUE7QUFDZSxFQUFBLGlCQUFBLEdBQUE7QUFDWCxJQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsZ0JBQVQsQ0FEVztFQUFBLENBQWI7O2lCQUFBOztJQURGLENBQUE7O0FBQUEsTUFJTSxDQUFDLE9BQVAsR0FBaUIsT0FKakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLFVBQUE7O0FBQUE7QUFDZSxFQUFBLG9CQUFBLEdBQUE7QUFDWCxJQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsZ0JBQVQsQ0FEVztFQUFBLENBQWI7O29CQUFBOztJQURGLENBQUE7O0FBQUEsTUFJTSxDQUFDLE9BQVAsR0FBaUIsVUFKakIsQ0FBQTs7Ozs7QUNDQSxJQUFBLCtEQUFBOztBQUFBLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVIsQ0FBVixDQUFBOztBQUFBLFNBQ0EsR0FBWSxPQUFBLENBQVEsb0JBQVIsQ0FEWixDQUFBOztBQUFBLFFBRUEsR0FBVyxPQUFBLENBQVEsbUJBQVIsQ0FGWCxDQUFBOztBQUFBLFVBR0EsR0FBYSxPQUFBLENBQVEscUJBQVIsQ0FIYixDQUFBOztBQUFBLE1BS0EsR0FBUyxPQUFBLENBQVEsaUJBQVIsQ0FMVCxDQUFBOztBQUFBLGFBUUEsR0FBZ0IsU0FBQyxJQUFELEdBQUE7O0lBQ2QsT0FBUTtHQUFSO0FBQ0EsU0FBTyxrQkFBQSxHQUFxQixHQUFyQixHQUEyQixJQUFsQyxDQUZjO0FBQUEsQ0FSaEIsQ0FBQTs7QUFBQSxPQWFPLENBQUMsTUFBUixDQUFlLFFBQWYsRUFBeUIsQ0FDdkIsU0FEdUIsRUFFdkIsU0FGdUIsRUFHdkIsV0FIdUIsRUFJdkIsWUFKdUIsRUFLdkIscUJBTHVCLENBQXpCLENBT0UsQ0FBQyxVQVBILENBT2MsU0FQZCxFQU95QixPQVB6QixDQVFFLENBQUMsVUFSSCxDQVFjLFdBUmQsRUFRMkIsU0FSM0IsQ0FTRSxDQUFDLE9BVEgsQ0FTVyxTQVRYLEVBU3NCLE1BVHRCLENBVUUsQ0FBQyxNQVZILENBVVUsU0FBQyxjQUFELEdBQUE7U0FDTixjQUNFLENBQUMsSUFESCxDQUNRLEdBRFIsRUFFSTtBQUFBLElBQUEsVUFBQSxFQUFZLFdBQVo7QUFBQSxJQUNBLFlBQUEsRUFBYyxPQURkO0FBQUEsSUFFQSxXQUFBLEVBQWEsYUFBQSxDQUFjLFlBQWQsQ0FGYjtHQUZKLENBS0UsQ0FBQyxJQUxILENBS1EsT0FMUixFQU1JO0FBQUEsSUFBQSxVQUFBLEVBQVksUUFBWjtBQUFBLElBQ0EsWUFBQSxFQUFjLE1BRGQ7QUFBQSxJQUVBLFdBQUEsRUFBYSxhQUFBLENBQWMsV0FBZCxDQUZiO0dBTkosQ0FTRSxDQUFDLElBVEgsQ0FTUSxTQVRSLEVBVUk7QUFBQSxJQUFBLFVBQUEsRUFBWSxVQUFaO0FBQUEsSUFDQSxZQUFBLEVBQWMsUUFEZDtBQUFBLElBRUEsV0FBQSxFQUFhLGFBQUEsQ0FBYyxhQUFkLENBRmI7R0FWSixDQWFFLENBQUMsU0FiSCxDQWNJO0FBQUEsSUFBQSxVQUFBLEVBQVksR0FBWjtHQWRKLEVBRE07QUFBQSxDQVZWLENBMkJFLENBQUMsTUEzQkgsQ0EyQlUsU0FBQyxpQkFBRCxHQUFBO1NBQ04saUJBQWlCLENBQUMsUUFBUSxDQUFDLG9CQUEzQixHQUFrRCxNQUQ1QztBQUFBLENBM0JWLENBOEJFLENBQUMsTUE5QkgsQ0E4QlUsU0FBQyxpQkFBRCxHQUFBO1NBQ04saUJBQWlCLENBQUMsU0FBbEIsQ0FBNEIsSUFBNUIsRUFETTtBQUFBLENBOUJWLENBaUNFLENBQUMsTUFqQ0gsQ0FpQ1UsU0FBQyxxQkFBRCxHQUFBO1NBQ04scUJBQXFCLENBQUMsY0FBdEIsR0FBdUMsTUFEakM7QUFBQSxDQWpDVixDQW9DRSxDQUFDLE1BcENILENBb0NVLFNBQUMsYUFBRCxHQUFBO0FBQ04sTUFBQSxVQUFBO1NBQUEsVUFBQSxHQUFhLFFBQVEsQ0FBQyxhQUFULENBQXVCLHVCQUF2QixDQUErQyxDQUFDLFFBRHZEO0FBQUEsQ0FwQ1YsQ0FiQSxDQUFBOzs7OztBQ0RBLElBQUEsUUFBQTs7QUFBQSxRQUFBLEdBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxTQUFPLGFBQUEsR0FBZ0IsSUFBdkIsQ0FEUztBQUFBLENBQVgsQ0FBQTs7QUFBQSxNQUdNLENBQUMsT0FBUCxHQUFpQixTQUFDLFNBQUQsR0FBQTtTQUNmO0FBQUEsSUFBQSxTQUFBLEVBQ0UsU0FBQSxDQUFVLFFBQUEsQ0FBUyxnQkFBVCxDQUFWLEVBQXNDO0FBQUEsTUFBQyxFQUFBLEVBQUksS0FBTDtLQUF0QyxFQUNFO0FBQUEsTUFBQSxPQUFBLEVBQ0U7QUFBQSxRQUFBLEdBQUEsRUFBSyxRQUFBLENBQVMsb0JBQVQsQ0FBTDtPQURGO0tBREYsQ0FERjtBQUFBLElBS0EsWUFBQSxFQUNFLFNBQUEsQ0FBVSxRQUFBLENBQVMsa0JBQVQsQ0FBVixFQUF3QztBQUFBLE1BQUMsRUFBQSxFQUFJLEtBQUw7S0FBeEMsRUFDRTtBQUFBLE1BQUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxHQUFBLEVBQUssUUFBQSxDQUFTLHFCQUFULENBQUw7T0FERjtLQURGLENBTkY7QUFBQSxJQVVBLE9BQUEsRUFDRSxTQUFBLENBQVUsUUFBQSxDQUFTLGlCQUFULENBQVYsRUFBdUM7QUFBQSxNQUFDLE1BQUEsRUFBUSxTQUFUO0tBQXZDLEVBQ0U7QUFBQSxNQUFBLE1BQUEsRUFDRTtBQUFBLFFBQUEsR0FBQSxFQUFLLFFBQUEsQ0FBUyxnQkFBVCxDQUFMO09BREY7S0FERixDQVhGO0lBRGU7QUFBQSxDQUhqQixDQUFBOzs7OztBQ0FBLElBQUEsVUFBQTs7QUFBQTtBQUNlLEVBQUEsb0JBQUEsR0FBQTtBQUNYLElBQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxnQkFBVCxDQURXO0VBQUEsQ0FBYjs7b0JBQUE7O0lBREYsQ0FBQTs7QUFBQSxNQUlNLENBQUMsT0FBUCxHQUFpQixVQUpqQixDQUFBOzs7OztBQ0FBLElBQUEsU0FBQTs7QUFBQTtBQUNFLHNCQUFBLFNBQUEsR0FBVyxJQUFYLENBQUE7O0FBQUEsc0JBQ0EsSUFBQSxHQUFNLEVBRE4sQ0FBQTs7QUFBQSxzQkFFQSxNQUFBLEdBQVEsQ0FGUixDQUFBOztBQUFBLHNCQUdBLFFBQUEsR0FBVSxFQUhWLENBQUE7O0FBQUEsc0JBSUEsV0FBQSxHQUFhLEtBSmIsQ0FBQTs7QUFBQSxzQkFLQSxPQUFBLEdBQVMsS0FMVCxDQUFBOztBQUFBLHNCQU1BLFVBQUEsR0FBWSxLQU5aLENBQUE7O0FBT2EsRUFBQSxtQkFBQyxNQUFELEVBQVMsT0FBVCxHQUFBO0FBQ1gsSUFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQWQsQ0FBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTthQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ25CLFlBQUEseURBQUE7QUFBQSxRQUFBLEtBQUMsQ0FBQSxTQUFELEdBQWEsSUFBYixDQUFBO0FBQUEsUUFDQSxLQUFDLENBQUEsSUFBRCxHQUFRLElBQUksQ0FBQyxJQURiLENBQUE7QUFBQSxRQUVBLEtBQUMsQ0FBQSxNQUFELEdBQVUsSUFBSSxDQUFDLE1BRmYsQ0FBQTtBQUFBLFFBR0EsS0FBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMsUUFIakIsQ0FBQTtBQUFBLFFBSUEsS0FBQyxDQUFBLElBQUQsR0FBUSxFQUpSLENBQUE7QUFBQSxRQUtBLE1BQUEsR0FBUyxFQUxULENBQUE7QUFNQTtBQUFBO2FBQUEscUNBQUE7MkJBQUE7QUFDRSxVQUFBLElBQUEsR0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBUCxDQUFBO0FBQ0EsZUFBQSx3Q0FBQTswQkFBQTtBQUNFLFlBQUEsR0FBQSxHQUFNLEdBQUcsQ0FBQyxJQUFKLENBQUEsQ0FBTixDQUFBO0FBQ0EsWUFBQSxJQUFHLEdBQUEsSUFBUyxDQUFDLENBQUEsTUFBUSxDQUFBLEdBQUEsQ0FBVCxDQUFaO0FBQ0UsY0FBQSxLQUFDLENBQUEsSUFBSSxDQUFDLElBQU4sQ0FBVyxHQUFYLENBQUEsQ0FBQTtBQUFBLGNBQ0EsTUFBTyxDQUFBLEdBQUEsQ0FBUCxHQUFjLElBRGQsQ0FERjthQUZGO0FBQUEsV0FEQTtBQU1BLGtCQUFPLE9BQU8sQ0FBQyxJQUFmO0FBQUEsaUJBQ08sU0FEUDtBQUVJLDJCQUFBLEtBQUMsQ0FBQSxXQUFELEdBQWUsS0FBZixDQUZKO0FBQ087QUFEUCxpQkFHTyxLQUhQO0FBSUksMkJBQUEsS0FBQyxDQUFBLE9BQUQsR0FBVyxLQUFYLENBSko7QUFHTztBQUhQLGlCQUtPLFFBTFA7QUFNSSwyQkFBQSxLQUFDLENBQUEsVUFBRCxHQUFjLEtBQWQsQ0FOSjtBQUtPO0FBTFAsV0FQRjtBQUFBO3VCQVBtQjtNQUFBLEVBQUE7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCLENBQUEsQ0FEVztFQUFBLENBUGI7O21CQUFBOztJQURGLENBQUE7O0FBQUEsTUFrQ00sQ0FBQyxPQUFQLEdBQWlCLFNBbENqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIEFwcEN0cmxcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcEN0cmxcbiIsImNsYXNzIFNlYXJjaEN0cmxcbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgQHRpdGxlID0gJ1RDSGVscGVyIHwgYXBwJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlYXJjaEN0cmxcbiIsIlxuYXBwQ3RybCA9IHJlcXVpcmUgJy4vYXBwQ3RybC5jb2ZmZWUnXG5zaGVldEN0cmwgPSByZXF1aXJlICcuL3NoZWV0Q3RybC5jb2ZmZWUnXG5kb25lQ3RybCA9IHJlcXVpcmUgJy4vZG9uZUN0cmwuY29mZmVlJ1xucGVyc29uQ3RybCA9IHJlcXVpcmUgJy4vcGVyc29uQ3RybC5jb2ZmZWUnXG5cbm1vZGVscyA9IHJlcXVpcmUgJy4vbW9kZWxzLmNvZmZlZSdcblxuXG50ZW1wbGF0ZV9wYXRoID0gKHBhdGgpIC0+XG4gIHBhdGggPz0gJydcbiAgcmV0dXJuIFRFTVBMQVRFX1BBVEhfQkFTRSArICcvJyArIHBhdGhcblxuXG5hbmd1bGFyLm1vZHVsZSgndGNoQXBwJywgW1xuICAnbmdSb3V0ZScsXG4gICduZ1RvdWNoJyxcbiAgJ25nQW5pbWF0ZScsXG4gICduZ1Jlc291cmNlJyxcbiAgJ2FuZ3VsYXItbG9hZGluZy1iYXInLFxuXSlcbiAgLmNvbnRyb2xsZXIgJ2FwcEN0cmwnLCBhcHBDdHJsXG4gIC5jb250cm9sbGVyICdzaGVldEN0cmwnLCBzaGVldEN0cmxcbiAgLmZhY3RvcnkgJyRtb2RlbHMnLCBtb2RlbHNcbiAgLmNvbmZpZyAoJHJvdXRlUHJvdmlkZXIpIC0+XG4gICAgJHJvdXRlUHJvdmlkZXJcbiAgICAgIC53aGVuICcvJyxcbiAgICAgICAgY29udHJvbGxlcjogJ3NoZWV0Q3RybCdcbiAgICAgICAgY29udHJvbGxlckFzOiAnc2hlZXQnXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdzaGVldC5odG1sJylcbiAgICAgIC53aGVuICcvZG9uZScsXG4gICAgICAgIGNvbnRyb2xsZXI6IGRvbmVDdHJsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ2RvbmUnXG4gICAgICAgIHRlbXBsYXRlVXJsOiB0ZW1wbGF0ZV9wYXRoKCdkb25lLmh0bWwnKVxuICAgICAgLndoZW4gJy9wZXJzb24nLFxuICAgICAgICBjb250cm9sbGVyOiBwZXJzb25DdHJsXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3BlcnNvbidcbiAgICAgICAgdGVtcGxhdGVVcmw6IHRlbXBsYXRlX3BhdGgoJ3BlcnNvbi5odG1sJylcbiAgICAgIC5vdGhlcndpc2VcbiAgICAgICAgcmVkaXJlY3RUbzogJy8nXG5cbiAgLmNvbmZpZyAoJHJlc291cmNlUHJvdmlkZXIpIC0+XG4gICAgJHJlc291cmNlUHJvdmlkZXIuZGVmYXVsdHMuc3RyaXBUcmFpbGluZ1NsYXNoZXMgPSBmYWxzZVxuXG4gIC5jb25maWcgKCRsb2NhdGlvblByb3ZpZGVyKSAtPlxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSB0cnVlXG5cbiAgLmNvbmZpZyAoY2ZwTG9hZGluZ0JhclByb3ZpZGVyKSAtPlxuICAgIGNmcExvYWRpbmdCYXJQcm92aWRlci5pbmNsdWRlU3Bpbm5lciA9IGZhbHNlXG5cbiAgLmNvbmZpZyAoJGh0dHBQcm92aWRlcikgLT5cbiAgICBjc3JmX3Rva2VuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPWNzcmYtdG9rZW5dJykuY29udGVudFxuIiwiYXBpX3BhdGggPSAocGF0aCkgLT5cbiAgcmV0dXJuIEFQSV9QQVRIX0JBU0UgKyBwYXRoXG5cbm1vZHVsZS5leHBvcnRzID0gKCRyZXNvdXJjZSkgLT5cbiAgJ1Byb2JsZW0nOlxuICAgICRyZXNvdXJjZSBhcGlfcGF0aCgnL3Byb2JsZW1zLzppZC8nKSwge2lkOiAnQGlkJ30sXG4gICAgICBzdGFycmVkOlxuICAgICAgICB1cmw6IGFwaV9wYXRoKCcvcHJvYmxlbXMvc3RhcnJlZC8nKVxuXG4gICdBc3NpZ25tZW50JzpcbiAgICAkcmVzb3VyY2UgYXBpX3BhdGgoJy9hc3NpZ25tZW50cy86aWQnKSwge2lkOiAnQGlkJ30sXG4gICAgICBzb2x2ZWQ6XG4gICAgICAgIHVybDogYXBpX3BhdGgoJy9hc3NpZ25tZW50cy9zb2x2ZWQnKVxuXG4gICdTaGVldCc6XG4gICAgJHJlc291cmNlIGFwaV9wYXRoKCcvc2hlZXRzLzpudW1iZXInKSwge251bWJlcjogJ0BudW1iZXInfSxcbiAgICAgIGxhdGVzdDpcbiAgICAgICAgdXJsOiBhcGlfcGF0aCgnL3NoZWV0cy9sYXRlc3QnKVxuIiwiY2xhc3MgUGVyc29uQ3RybFxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICBAdGl0bGUgPSAnVENIZWxwZXIgfCBhcHAnXG5cbm1vZHVsZS5leHBvcnRzID0gUGVyc29uQ3RybFxuIiwiY2xhc3Mgc2hlZXRDdHJsXG4gIHNoZWV0RGF0YTogbnVsbFxuICBkYXRlOiAnJ1xuICBudW1iZXI6IDBcbiAgcHJvYmxlbXM6ICcnXG4gIGhhc19vdmVyZHVlOiBmYWxzZVxuICBoYXNfbmV3OiBmYWxzZVxuICBoYXNfcmV2aWV3OiBmYWxzZVxuICBjb25zdHJ1Y3RvcjogKCRzY29wZSwgJG1vZGVscykgLT5cbiAgICAkbW9kZWxzLlNoZWV0LmxhdGVzdCAoZGF0YSkgPT5cbiAgICAgIEBzaGVldERhdGEgPSBkYXRhXG4gICAgICBAZGF0ZSA9IGRhdGEuZGF0ZVxuICAgICAgQG51bWJlciA9IGRhdGEubnVtYmVyXG4gICAgICBAcHJvYmxlbXMgPSBkYXRhLnByb2JsZW1zXG4gICAgICBAdGFncyA9IFtdXG4gICAgICB0YWdNYXAgPSB7fVxuICAgICAgZm9yIHByb2JsZW0gaW4gQHByb2JsZW1zXG4gICAgICAgIHRhZ3MgPSBwcm9ibGVtLnRhZ3Muc3BsaXQoJywnKVxuICAgICAgICBmb3IgdGFnIGluIHRhZ3NcbiAgICAgICAgICB0YWcgPSB0YWcudHJpbSgpXG4gICAgICAgICAgaWYgdGFnICBhbmQgKCF0YWdNYXBbdGFnXSlcbiAgICAgICAgICAgIEB0YWdzLnB1c2ggdGFnXG4gICAgICAgICAgICB0YWdNYXBbdGFnXSA9IHRydWVcbiAgICAgICAgc3dpdGNoIHByb2JsZW0udHlwZVxuICAgICAgICAgIHdoZW4gJ292ZXJkdWUnXG4gICAgICAgICAgICBAaGFzX292ZXJkdWUgPSB0cnVlXG4gICAgICAgICAgd2hlbiAnbmV3J1xuICAgICAgICAgICAgQGhhc19uZXcgPSB0cnVlXG4gICAgICAgICAgd2hlbiAncmV2aWV3J1xuICAgICAgICAgICAgQGhhc19yZXZpZXcgPSB0cnVlXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgXG4gICAgICBcblxubW9kdWxlLmV4cG9ydHMgPSBzaGVldEN0cmxcbiJdfQ==
