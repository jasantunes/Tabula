"use strict";

function dateNDaysAgo(n) {
  var now = new Date();
  return Number(new Date(now.getFullYear(), now.getMonth(), now.getDate()-n));
}

var Tabula = angular.module('Tabula', ['xeditable']);

Tabula.run(function(editableOptions) {
  editableOptions.theme = 'default'; // default, bs2 or bs3
});

// Converts associative array to array and provides sort function.
// It also removes the most recent objects (from_today = 1 remove today).
Tabula.filter('orderObjectBy', function() {
  return function(items, field, from_today, reverse) {
      var filtered = [];
      var date_threshold = dateNDaysAgo(from_today);
      angular.forEach(items, function(item, key) {
        if (key <= date_threshold) {
          item["key"] = key;
          filtered.push(item);
        }
      });
      filtered.sort(function (a, b) {
          if(a[field] > b[field]) return 1;
          else if(a[field] < b[field]) return -1;
          else return 0;
      });
      if(reverse) filtered.reverse();
      return filtered;
  };
});

// showRecentDays:0 today
// showRecentDays:1 today and yesterday
Tabula.filter('showRecentDays', function() {
  return function(items, n) {
    var filtered = [];
    var date_threshold = dateNDaysAgo(n);
    angular.forEach(items, function(item , key) {
      if (key >= date_threshold) {
        item["key"] = key;
        filtered.push(item);
      }
      filtered.sort(function (a, b) {
        if(a.done && !b.done) return 1;
        else if(!a.done && b.done) return -1;
        else return 0;
      });
    });
    return filtered;
  };
});

function TabulaController($scope, $filter, $http, gdocs) {

  // Get background of the day
  $scope.bg_of_the_day = backgrounds[rnd_index];
  console.log("Background of the day: " + $scope.bg_of_the_day.file);
  $scope.alerts = {today_was_populated: false};
  $scope.todos = {};

  // chrome.storage.sync.get is asynchronous
  chrome.storage.sync.get(null, todos => {
    if (chrome.runtime.lastError) {
      console.log('error reading from chrome sync storage: ', chrome.runtime.lastError);
    }
    else {
      // The $apply is necessary to execute the function inside Angular scope
      $scope.$apply(() => {
        $scope.onload(todos);
      });
    }
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace == 'sync') {
      $scope.$apply(() => {
        for (let key in changes) {
          $scope.onload({[key]: changes[key].newValue});
        }
      });
    }
  });

  // Populate scope with loaded data from storage.
  $scope.onload = function(value) {
    console.log('got data from sync', value);
    $scope.today = dateNDaysAgo(0);

    for (let value_key in value) {
      if (value_key.startsWith("todolist-")) {
        let key = Number(value_key.substr("todolist-".length));
        if (value[value_key])
          $scope.todos[key] = value[value_key];
        else
          delete $scope.todos[key];
      }
    }

    // If there's no entry for today, populate new today entry with pending todo items
    // from the most recent day.
    var now = $scope.today;
    if (!$scope.todos[now]) {
      $scope.todos[now] = [];
      var older_items = $filter('orderObjectBy')($scope.todos, "key", 1, true);
      if (older_items.length > 0) {
        for (var i = 0; i < older_items[0].length; ++i) {
          if (!older_items[0][i].done && !older_items[0][i].deleted) {
            var event_text = older_items[0][i].text;
            console.log("adding: " + event_text);
            $scope.todos[now].push({done:false, text:event_text});
            $scope.alerts.today_was_populated = true;
          }
        }
      }
    }
  };

  /*
   * Save a day to storage.
   */
  $scope.save = function(day) {
    console.log("saving", day);
    let arr = $scope.todos[day]
      .filter(event => event.text && !event.deleted)
      .map(event => ({text: event.text, done: event.done}));
    chrome.storage.sync.set({['todolist-' + day]: arr}, () => {
      if (chrome.runtime.lastError) {
        console.log('error writing to chrome sync storage:', chrome.runtime.lastError);
      }
      else {
        console.log('saved');
      }
    });
  };

  /*
   * Add new to-do (today).
   */
  $scope.addTodo = function() {
    if ($scope.todoText) {
      $scope.todos[$scope.today].push({done:false, text:$scope.todoText});
      $scope.todoText = ''; // clear the form
      $scope.save($scope.today);
    }
  };

  /*
   * Archive (delete all elements for now).
   */
  $scope.archive = function() {
    var oldTodos = $scope.todos;
    $scope.todos = {};
//    angular.forEach(oldTodos, function(item) {
//      if (!item.done) $scope.todos.push(item);
//    });
  };
}

TabulaController.$inject = [ '$scope', '$filter' ];
