console.log('concept.js loaded');

/*
Todo List:
1. Start migration to MVC pattern
2. Escape the console
*/

// =================================
//          prototype
// =================================

//feed example data to browser console
seedData();

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
  return (function find(inArray) {
    inArray.forEach(function(currentTodo, index) {
      //base case
      if (currentTodo.text === text) {
        foundTodo = currentTodo;
        return;
      }
      //recursive case
      if (currentTodo.subTodo !== null) {
        return find(currentTodo.subTodo);
      }
    });
    return foundTodo;
  })($todoList.$root);
};

//function to add todos at named level
TodoList.prototype.insertTodo = function(text, parent) {
  if (parent) {
    return (function find(inArray) {
      inArray.forEach(function(currentTodo, index) {
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
          return find(currentTodo.subTodo);
        }
      });
    })($todoList.$root);
  } else {
    $todoList.$root.push(new Todo(text));
    return `"${text}" was inserted at $root`;
  }
};

TodoList.prototype.deleteTodo = function(text) {
  let previousTodo;
  return (function find(inArray) {
    inArray.forEach(function(currentTodo, index) {
      //base case
      if (currentTodo.text === text) {
        if (previousTodo) {
          let index = previousTodo.subTodo.indexOf(currentTodo);
          previousTodo.subTodo.splice(index, 1);
          //if no previous todo (ie currently at $root)
        } else {
          let index = inArray.indexOf(currentTodo);
          inArray.splice(index, 1);
          return `"${text}" was deleted`;
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
  })($todoList.$root);
};

TodoList.prototype.toggleTodo = function(text) {
  return (function find(inArray) {
    inArray.forEach(function(currentTodo, index) {
      //base case
      if (currentTodo.text === text) {
        currentTodo.completed = !currentTodo.completed;
        let shouldToggle = currentTodo.completed;
        //toggle children recursive case
        if (currentTodo.subTodo !== null) {
          (function toggleAllChildren(child) {
            child.forEach(function(currentChild, index) {
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
        return find(currentTodo.subTodo);
      }
    });
  })($todoList.$root);
};

TodoList.prototype.toggleAll = function() {
  let areAllToggled = (function findIncompleteTodo(inArray) {
    return inArray.every(function(currentTodo, index) {
      //base case
      //if even one of the todos is not complete, set areAllToggled to false
      if (currentTodo.completed === false) return false;
      //recursive case
      if (currentTodo.subTodo !== null) {
        findIncompleteTodo(currentTodo.subTodo);
        return true;
      }
    });
  })($todoList.$root);

  (function find(inArray) {
    inArray.forEach(function(currentTodo) {
      //base case
      currentTodo.completed = !areAllToggled;
      //recursive case
      if (currentTodo.subTodo !== null) {
        return find(currentTodo.subTodo);
      }
    });
  })($todoList.$root);
};

TodoList.prototype.editTodo = function(text, newText) {
  return (function find(inArray) {
    inArray.forEach(function(currentTodo, index) {
      //base case
      if (currentTodo.text === text) {
        currentTodo.edit(newText);
        return `"${text}" was edited to "${newText}"`;
        return;
      }
      //recursive case
      if (currentTodo.subTodo !== null) {
        return find(currentTodo.subTodo);
      }
    });
  })($todoList.$root);
};

TodoList.prototype.totalTodos = function() {
  let counter = 0;
  return (function find(inArray) {
    inArray.forEach(function(currentTodo, index) {
      counter++;
      //recursive case
      if (currentTodo.subTodo !== null) {
        return find(currentTodo.subTodo);
      }
      //base case
      return;
    });
    return counter;
  })($todoList.$root);
};

TodoList.prototype.displayTodos = function() {
  console.log(`\nTodoList: ${$todoList.totalTodos()} item(s).\n \n`);
  let indentation = 0;
  (function find(inArray) {
    inArray.forEach(function(currentTodo, index, inArray) {
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
        return find(currentTodo.subTodo);
      }
      return;
    });
    indentation--;
  })($todoList.$root);
};

const generate = function() {
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

function seedData() {
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
  $todoList.toggleTodo('climb the student ranks');
  $todoList.toggleTodo('prototype nested todo list');
  $todoList.toggleTodo('read documentation');
  console.log($todoList)
  $todoList.displayTodos();
}




