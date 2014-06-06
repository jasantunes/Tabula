
// Initializes to-do list with testing items instead of loading them from storage.
debug = false;

function dateNDaysAgo(n) {
  var now = new Date();
  return new Number(new Date(now.getFullYear(), now.getMonth(), now.getDate()-n));
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
      var date_threshold = new dateNDaysAgo(from_today);
      angular.forEach(items, function(item , key) {
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
    var date_threshold = new dateNDaysAgo(n);
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
	
	// Notice that chrome.storage.sync.get is asynchronous
  chrome.storage.sync.get('todolist', function(value) {
    // The $apply is only necessary to execute the function inside Angular scope
    $scope.$apply(function() {
      $scope.load(value);
    });
  });
  
  // Load data from storage.
  $scope.load = function(value) {
    
    // Alerts.
    $scope.alert_today_was_populated = false;

    // Initialization of to-do items.
    $scope.todos = {};
    
    // Get background of the day
    $scope.bg_of_the_day =  backgrounds[rnd_index];
    console.log("Background of the day: " + $scope.bg_of_the_day.file);
    
    // Initialization for debugging purposes.
    if (debug) {
      $scope.todos = {
          123000000000 : [ {done:true,  text:"event1", deleted:false}, {done:true,  text:"event2", deleted:false}],
          456000000000 : [ {done:false, text:"event3", deleted:false}, {done:true,  text:"event4", deleted:false},  {done:true, text:"event5", deleted:false}],
          789000000000 : [ {done:false,  text:"event6", deleted:false}, {done:false, text:"event7", deleted:false}],
          999000000000 : [ {done:false,  text:"event3", deleted:false}, {done:true, text:"event7", deleted:false}],
          1000000000000 : [ {done:false,  text:"event3", deleted:false}, {done:true, text:"event7", deleted:false}]
      };
    }
    // Load saved data.
    else if (value && value.todolist) {
      $scope.todos = value.todolist;
    }
    
    // If there's no entry for today, populate new today entry with all pending todo items.
    var now = dateNDaysAgo(0);
    var has_today_items = ($scope.todos[now] != null && $scope.todos[now].length > 0);
    if (!has_today_items) {
      var older_items = $filter('orderObjectBy')($scope.todos, "key", 1, false);
      var pending_items = [];
      $scope.todos[now] = [];
      console.log("PENDING " + older_items.length);
      for (var day in older_items) {
        for (var i = 0; i < older_items[day].length; ++i) {
          var event_text = older_items[day][i].text;
          var existing_index =  pending_items.indexOf(event_text);
          
          if (!older_items[day][i].done) {
            // Add all todo items in which we worked on (and haven't concluded).
            if(existing_index < 0) {
              console.log("adding: " + event_text);
              pending_items.push(event_text);
            }
          }
          
          else {
            // But remove the todo item if we have conclude it.
            console.log("removing: " + event_text);
            if(existing_index >=0 ) {
              pending_items.splice(existing_index, 1);
            }
          }
        }
      }
      
      // Now add all pending items to today's entry.
      if (pending_items.length > 0) {
	      $scope.alert_today_was_populated = true;
	      for (var t in pending_items) {
	        console.log("finally adding: " + pending_items[t]);
	        $scope.todos[now].push({done:false, text:pending_items[t], deleted:false});        
	      }
      }
      
    } // if (!has_today_items)
    
      
  };
  
  /*
   * Save data to storage.
   */
  $scope.save = function() {
    for (var day in $scope.todos) {
      var is_empty = true;
      for (var i = $scope.todos[day].length; i--;) {
        var todo = $scope.todos[day][i];
        // delete the item
        if (todo != null && todo.deleted) {
          $scope.todos[day].splice(i, 1);
        }
        else {
          is_empty = false;
        }
      }
      // delete empty days
      if (is_empty) {
        delete $scope.todos[day];
      }
    }
    
    chrome.storage.sync.set({'todolist': $scope.todos});
    console.log("saved");
  };
  
  /*
   * Add new to-do (today).
   */
  $scope.addTodo = function() {
    var now = dateNDaysAgo(0);
    
    if ($scope.todos[now] == null) {
      console.log("null");
      $scope.todos[now] = [{done:false, text:$scope.todoText, deleted:false}];
    } else {
      console.log("!null");
      $scope.todos[now].push({done:false, text:$scope.todoText, deleted:false});
    }
    
    // Clear the form.
    $scope.todoText = '';
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

