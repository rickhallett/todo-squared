/*
Todo List:
1. Start migration to MVC pattern
2. Escape the console
*/

// =================================
//        escape the console
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

Todo.prototype.edit = function(text) {
  this.text = text;
  this.dateModified = new Date();
};

//function to find todos by name
//EXTRA FEATURE: store all todos with matching text, create array and return all these todos with link to parent
TodoList.prototype.findTodo = function(text) {
  let foundTodo;
  return (function findIn(array) {
    array.forEach(function(currentTodo) {
      //base case
      if (currentTodo.text === text) {
        foundTodo = currentTodo;
        return;
      }
      //recursive case
      if (currentTodo.subTodo !== null) {
        return findIn(currentTodo.subTodo);
      }
    });
    return foundTodo;
  })(this.$root);
};

function addTodo(text) {
  todoList.push(text);
}

//function to add todos at named level
TodoList.prototype.insertTodo = function(text, parent) {
  if (parent) {
    return (function insertIn(array) {
      array.forEach(function(currentTodo) {
        //base case
        if (currentTodo.text === parent) {
          //if no array, initialise array
          if (currentTodo.subTodo === null) {
            currentTodo.subTodo = [];
          }
          currentTodo.subTodo.push(new Todo(text, parent));
          return `"${text}" was inserted at "${parent}"`;
          //NB: does return stop for each?
          return;
        }
        //recursive case
        if (currentTodo.subTodo !== null) {
          return insertIn(currentTodo.subTodo);
        }
      });
    })(this.$root);
  } else {
    this.$root.push(new Todo(text));
    return `"${text}" was inserted at $root`;
  }
};

TodoList.prototype.deleteTodo = function(text) {
  let previousTodo;
  return (function deleteIn(array) {
    array.forEach(function(currentTodo) {
      //base case
      if (currentTodo.text === text) {
        if (previousTodo) {
          let index = previousTodo.subTodo.indexOf(currentTodo);
          previousTodo.subTodo.splice(index, 1);
          //if no previous todo (ie currently at $root)
        } else {
          let index = array.indexOf(currentTodo);
          array.splice(index, 1);
          return `"${text}" was deleted`;
        }
        return;
      }
      //recursive case
      if (currentTodo.subTodo !== null) {
        //store previous todo for deletion
        previousTodo = currentTodo;
        return deleteIn(currentTodo.subTodo);
      }
    });
  })(this.$root);
};

TodoList.prototype.toggleTodo = function(text) {
  return (function toggleIn(array) {
    array.forEach(function(currentTodo) {
      //base case
      if (currentTodo.text === text) {
        currentTodo.completed = !currentTodo.completed;
        let shouldToggle = currentTodo.completed;
        //toggle children recursive case
        if (currentTodo.subTodo !== null) {
          (function toggleAllChildren(child) {
            child.forEach(function(currentChild) {
              currentChild.completed = shouldToggle;
              if (currentChild.subTodo !== null) {
                toggleAllChildren(currentChild.subTodo);
              }
            });
          })(currentTodo.subTodo);
        }
        return;
      }
      //single nested recursive case
      if (currentTodo.subTodo !== null) {
        return toggleIn(currentTodo.subTodo);
      }
    });
  })(this.$root);
};

TodoList.prototype.toggleAll = function() {
  //use 'every' to determine if all todos are toggled
  let areAllToggled = (function findIncompleteTodo(array) {
    return array.every(function(currentTodo) {
      //base case
      //if even one of the todos is not complete, set areAllToggled to false
      if (currentTodo.completed === false) return false;
      //recursive case
      if (currentTodo.subTodo !== null) {
        findIncompleteTodo(currentTodo.subTodo);
        return true;
      }
    });
  })(this.$root);

  //use 'forEach' to set all todos to either complete or non-complete
  (function toggleAllIn(array) {
    array.forEach(function(currentTodo) {
      //base case
      currentTodo.completed = !areAllToggled;
      //recursive case
      if (currentTodo.subTodo !== null) {
        return toggleAllIn(currentTodo.subTodo);
      }
    });
  })(this.$root);
};

TodoList.prototype.editTodo = function(text, newText) {
  return (function editIn(array) {
    array.forEach(function(currentTodo) {
      //base case
      if (currentTodo.text === text) {
        currentTodo.edit(newText);
        return `"${text}" was edited to "${newText}"`;
        return;
      }
      //recursive case
      if (currentTodo.subTodo !== null) {
        return editIn(currentTodo.subTodo);
      }
    });
  })(this.$root);
};

TodoList.prototype.totalTodos = function() {
  let counter = 0;
  return (function countIn(array) {
    array.forEach(function(currentTodo) {
      counter++;
      //recursive case
      if (currentTodo.subTodo !== null) {
        return countIn(currentTodo.subTodo);
      }
      //base case
      return;
    });
    return counter;
  })(this.$root);
};

/*********************************************
 *          UNDER CONSTRUCTION *
 ********************************************/

//option 1: construct each component seperately, using logic to determine type/class, appending elements to DOM sequentially
//option 1.1: it might be good to have seperate helper functions that can create these elements
//todo__subTask uls will need to be appendChild to the master todo containers
//within this ul, we can repeat .todos => .todo => .todo__task => checkbox/label -> destroy button
//option 2: construct one compound element, using position in recursion and logic to determine type/class, appending elements to DOM once

function insertTodo(text, parent_node) {
  let newTodo = constructTodoComponent(text);
  parent_node.insertAdjacentElement('beforeend', newTodo);
}

function placeInside(child_node, parent_node) {
  parent_node.insertAdjacentElement('beforeend', child_node);
}

function mockDOM() {
  //grab master todo list and create container div
  let app = document.getElementById('app');
  let todoContainer = constructContainer();

  let helloWorldList = constructTodoList();
  insertTodo('Hello, from JavaScript!', helloWorldList);

  let helloWorldSubList = constructSubTodoList();
  insertTodo('Create DOM component constructors', helloWorldSubList);
  insertTodo('Find method to nest these', helloWorldSubList);
  insertTodo('Weave into recursive displayTodos', helloWorldSubList);

  placeInside(helloWorldSubList, helloWorldList);

  let recursionSubList = constructSubTodoList();
  insertTodo('compelete construction inner API', recursionSubList);
  insertTodo('migrate into TodoList.prototype.render', recursionSubList);
  insertTodo('construct tests', recursionSubList);

  placeInside(recursionSubList, helloWorldSubList);

  placeInside(helloWorldList, todoContainer);

  placeInside(todoContainer, app);
}

TodoList.prototype.render = function() {

  mockDOM();


  //-- Basic Algorithm --
  //iterate
  //print root todo
  //check if has children
  //recurse into children
  //iterate
  //print children
  //...continue recursion

  (function constructDOM(fromArray) {
    fromArray.forEach(function(currentTodo, index) {
      //base case

      //recursive case
      return;
    });
  })(this.$root);
};

/*
if (node.parentNode) {
  // remove a node from the tree, unless
  // it's not in the tree already
  node.parentNode.removeChild(node);
}
*/

/*********************************************
 *          UNDER CONSTRUCTION *
 ********************************************/

TodoList.prototype.displayTodos = function() {
  console.log(`\nTodoList: ${this.totalTodos()} item(s).\n \n`);
  let indentation = 0;
  (function print(array) {
    array.forEach(function(currentTodo, index) {
      let spaces = '';
      let completedMark = '( )';
      for (let i = 1; i <= indentation; i++) {
        spaces += '     ';
      }
      if (currentTodo.completed === true) {
        completedMark = '(x)';
      }
      console.log(`${completedMark}${spaces} ${index + 1} ${currentTodo.text}`);
      //recursive case
      if (currentTodo.subTodo !== null) {
        indentation++;
        return print(currentTodo.subTodo);
      }
      return;
    });
    indentation--;
  })(this.$root);
};

//feed example data to browser console
let $todoList = new TodoList();
$todoList.insertTodo('Master watchandcode');
$todoList.insertTodo('Become a Javascript ninja');
$todoList.insertTodo('Overthrow Gordon');
$todoList.insertTodo('Roll up him in a yoga mat', 'Overthrow Gordon');
$todoList.insertTodo('consider reviewing some videos', 'Master watchandcode');
$todoList.insertTodo(
  'get a javascript developer job',
  'Become a Javascript ninja'
);
$todoList.insertTodo('prototype nested todo list', 'Become a Javascript ninja');
$todoList.insertTodo('complete BYOA', 'Become a Javascript ninja');
$todoList.insertTodo('master vue.js', 'Become a Javascript ninja');
$todoList.insertTodo('complete tutorial', 'master vue.js');
$todoList.insertTodo('read documentation', 'master vue.js');
$todoList.insertTodo('implement TodoSquared', 'master vue.js');
$todoList.insertTodo(
  'build a robust web app',
  'get a javascript developer job'
);
$todoList.toggleTodo('prototype nested todo list');
$todoList.toggleTodo('read documentation');

console.log($todoList);
$todoList.displayTodos();

$todoList.render();
