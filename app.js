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
  this.id = generateID();
  this.parent = parent || '$root';
  this.text = text;
  this.completed = false;
  this.dateCreated = new Date();
  this.subTodo = null;
}

const generateID = function() {
  const ALPHABET =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const ID_LENGTH = 8;
  let rtn = '';
  for (let i = 0; i < ID_LENGTH; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    if (i === 2 || i === 5) {
      rtn += '-';
    }
  }
  return rtn;
};

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

/*********************************************
 *          UNDER CONSTRUCTION *
 ********************************************/

function constructContainer() {
  //create container div for app
  let todoContainer = document.createElement('div');
  todoContainer.className = 'todoContainer';

  //create div to contain header elements
  let header = document.createElement('div');
  header.id = 'header';

  let toggleAllIcon = document.createElement('i');
  toggleAllIcon.className = 'fas fa-angle-down fa-2x toggle-all';
  header.appendChild(toggleAllIcon);

  let input = document.createElement('input');
  input.id = 'enter';
  input.placeholder = 'What would you like todo?';
  header.appendChild(input);

  let addTodoButton = document.createElement('button');
  addTodoButton.id = 'add-todo';
  addTodoButton.textContent = 'Add Todo';
  header.appendChild(addTodoButton);

  todoContainer.appendChild(header);
  return todoContainer;
}

function constructTodoComponent(text) {
  //create todo div to create consistent todo styling
  let todoLI = document.createElement('li');
  todoLI.className = 'todo';

  let todoText = document.createElement('div');
  todoText.className = 'todo-text';

  //create checkbox and insert it into todo-text div
  let toggleCheckbox = document.createElement('input');
  toggleCheckbox.type = 'checkbox';
  toggleCheckbox.id = 'toggle';
  todoText.appendChild(toggleCheckbox);

  //create todo text label and insert it into todo-text div
  let todo = document.createElement('label');
  //HACK: unknown cause of label text closer to checkbox when created through this function
  todo.textContent = ' ' + text;
  todoText.appendChild(todo);

  //insert compound todo-text div into parent todo div
  todoLI.appendChild(todoText);

  //create destroy button and insert it into parent todo div
  let destroyButton = document.createElement('button');
  destroyButton.className = 'destroy';
  destroyButton.textContent = 'x';
  todoLI.appendChild(destroyButton);

  return todoLI;
}

function constructTodoList() {
  let todoList = document.createElement('ul');
  todoList.className = 'todo-list';
  return todoList;
}

function constructSubTodoList() {
  let subTodoList = document.createElement('ul');
  subTodoList.className = 'sub-todo-list';
  return subTodoList;
}


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
  //grab master todo list and create container div
  let app = document.getElementById('app');
  let todoContainer = constructContainer();
  placeInside(todoContainer, app);

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
