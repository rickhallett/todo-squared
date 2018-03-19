console.log('concept.js loaded');

/*
Todo List:
1. create recursive functions that 'walk' rootTodo, printing out each layer
2. Prevent user from adding identical todos at the same level
*/


//create a function that takes the parent text and child text
//create the function on the data object, so that it can traverse with 'this'
//if no parent text, make parent text 'root'

//the data structure is a series of nested objects
//each object needs a unique identifier, todo text, completed property, and a reference to both its parent and any child todos

// =================================
//          prototype
// =================================

function TodoList() {
  this.$root = [];
}

//function constructor to create todos
function Todo(text, parent) {
  this.id = generate();
  this.parent = parent || '$root';
  this.text = text;
  this.completed = false;
  this.dateCreated = new Date();
  this.subTodo = null;
}

//function to find todos by name
//EXTRA FEATURE: store all todos with matching text, create array and return all these todos with link to parent
//REFACTOR: all other todo methods should be able to use findTodo as their common base
TodoList.prototype.findTodo = function (text) {
  let foundTodo;
  function find(inArray) {
    inArray.forEach(function (currentTodo, index) {
      //recursive case
      if (currentTodo.subTodo !== null) {
        return find(currentTodo.subTodo);
      }
      //base case
      if (currentTodo.text === text) {
        foundTodo = currentTodo;
        return;
      }
    });
    return foundTodo;
  }
  return find($todoList.$root);
}

//function to add todos at named level
TodoList.prototype.insertTodo = function (text, parent) {
  if (parent) {
    function find(inArray) {
      inArray.forEach(function (currentTodo, index) {
        //base case
        if (currentTodo.text === parent) {
          //if no array, initialise array
          if (currentTodo.subTodo === null) {
            currentTodo.subTodo = [];
          }
          currentTodo.subTodo.push(new Todo(text, parent));
          //NB: does return stop for each?
          return;
        }
        //recursive case
        if (currentTodo.subTodo !== null) {
          return find(currentTodo.subTodo);
        }

      });
    }
    find($todoList.$root)
  } else {
    $todoList.$root.push(new Todo(text, parent));
  }
}

TodoList.prototype.deleteTodo = function (text) {
  let previousTodo;
  function find(inArray) {
    inArray.forEach(function (currentTodo, index) {
      //base case
      if (currentTodo.text === text) {
        if(previousTodo) {
          let index = previousTodo.subTodo.indexOf(currentTodo);
          previousTodo.subTodo.splice(index, 1);
          //if no previous todo (ie currently at $root)
        } else {
          let index = inArray.indexOf(currentTodo);
          inArray.splice(index, 1);
        }
        return;
      }
      //recursive case
      if (currentTodo.subTodo !== null) {
        //store previous todo for deletion
        previousTodo = currentTodo;
        return find(currentTodo.subTodo);
      }
      
    });
  }
  return find($todoList.$root);
}

TodoList.prototype.toggleTodo = function(text) {
  let foundTodo;
  function find(inArray) {
    inArray.forEach(function (currentTodo, index) {
      //base case
      if (currentTodo.text === text) {
        currentTodo.completed = !currentTodo.completed;
        let shouldToggle = currentTodo.completed;
        //toggle children recursive case
        if (currentTodo.subTodo !== null) {
          // debugger;
          (function toggleAllChildren(child){
            child.forEach(function(currentChild, index) {
              currentChild.completed = shouldToggle;
              if(currentChild.subTodo !== null) {
                toggleAllChildren(currentChild.subTodo);
              }
            });
          })(currentTodo.subTodo);
        }
        return;
      }
      //single nested recursive case
      if (currentTodo.subTodo !== null) {
        return find(currentTodo.subTodo);
      }
    });
    return foundTodo;
  }
  return find($todoList.$root);
}

TodoList.prototype.totalTodos = function () {
  let counter = 0;
  function find(inArray) {
    inArray.forEach(function (currentTodo, index) {
      counter++;
      //recursive case
      if (currentTodo.subTodo !== null) {
        return find(currentTodo.subTodo);
      }
      //base case
      return;
    });
    return counter;
  }
  return find($todoList.$root);
}

TodoList.prototype.displayTodos = function () {
  console.log(`\nTodoList: ${$todoList.totalTodos()} item(s).\n \n`)
  let indentation = 0;
  function find(inArray) {
    inArray.forEach(function (currentTodo, index, inArray) {
      let spaces = '';
      let completedMark = '( )';
      for (let i = 1; i <= indentation; i++) {
        spaces += '     ';
      }
      if(currentTodo.completed === true) {
        completedMark = '(x)'
      }
      console.log(`${completedMark}${spaces} ${index + 1} ${currentTodo.text}`)
      //recursive case
      if (currentTodo.subTodo !== null) {
        indentation++;
        return find(currentTodo.subTodo);
      }
      return;
    });
    indentation--;
  }
  return find($todoList.$root);
}

const generate = function () {
  const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const ID_LENGTH = 8;
  let rtn = '';
  for (let i = 0; i < ID_LENGTH; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    if (i === 2 || i === 5) {
      rtn += '-';
    }
  }
  return rtn;
}

let $todoList = new TodoList();

$todoList.insertTodo('Complete watchandcode');
$todoList.insertTodo('master javascript');
$todoList.insertTodo('Overthrow Gordon');
$todoList.insertTodo('climb the student ranks', 'Overthrow Gordon');
$todoList.insertTodo('consider reviewing some videos', 'Complete watchandcode');
$todoList.insertTodo('get a javascript developer job', 'master javascript');
$todoList.insertTodo('prototype nested todo list', 'master javascript');
$todoList.insertTodo('complete BYOA', 'master javascript');
$todoList.insertTodo('master vue.js', 'master javascript');
$todoList.insertTodo('complete tutorial', 'master vue.js');
$todoList.insertTodo('read documentation', 'master vue.js');
$todoList.insertTodo('implement TodoSquared', 'master vue.js');
$todoList.insertTodo('build a robust web app', 'get a javascript developer job');
$todoList.toggleTodo('climb the student ranks')
$todoList.toggleTodo('prototype nested todo list')
$todoList.toggleTodo('read documentation')

// console.log($todoList)
$todoList.displayTodos();