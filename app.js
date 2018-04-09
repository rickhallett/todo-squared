/*
Todo List:
1. Escape the console
*/

// =================================
//        escape the console
// =================================

let utils = {
  generateID: function () {
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
  }
};

class TodoList {
  constructor() {
    this.$root = [];
  }
}

class Todo {
  constructor(text, parent) {
    this.id = utils.generateID();
    this.parent = parent || '$root';
    this.text = text;
    this.completed = false;
    this.dateCreated = new Date();
    this.subTodo = null;
  }

  edit(text) {
    this.text = text;
    this.dateModified = new Date();
  }
}

let inDevelopment = {};

let model = new TodoList();

let view = {
  consoleRender: todoList => {
    console.log(`\nTodoList: ${controller.totalTodos(todoList)} item(s).\n \n`);
    let indentation = 0;
    (function print(array) {
      array.forEach(function (currentTodo, index) {
        let spaces = '';
        let completedMark = '( )';
        for (let i = 1; i <= indentation; i++) {
          spaces += '     ';
        }
        if (currentTodo.completed === true) {
          completedMark = '(x)';
        }
        console.log(
          `${completedMark}${spaces} ${index + 1} ${currentTodo.text}`
        );
        //recursive case
        if (currentTodo.subTodo !== null) {
          indentation++;
          return print(currentTodo.subTodo);
        }
        return;
      });
      indentation--;
    })(todoList);
  },
  render: () => { }
};

let controller = {
  editTodo: (todoList, text, newText) => {
    return (function editIn(array) {
      array.forEach(function (currentTodo) {
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
    })(todoList);
  },
  //TO ADD: find multiple matching todo texts if exist
  //USE CASE: controller.findTodo(model.$root, 'find this todo');
  findTodo: (todoList, text) => {
    let foundTodo;
    return (function findIn(array) {
      array.forEach(function (currentTodo) {
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
    })(todoList);
  },
  //USE CASE: controller.findTodo(model.$root, 'find this todo');
  insertTodo: (todoList, text, parent) => {
    if (parent) {
      return (function insertIn(array) {
        array.forEach(function (currentTodo) {
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
      })(todoList);
    } else {
      todoList.push(new Todo(text));
      return `"${text}" was inserted at $root`;
    }
  },
  deleteTodo: (todoList, text) => {
    let previousTodo;
    return (function deleteIn(array) {
      array.forEach(function (currentTodo) {
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
    })(todoList);
  },
  toggleTodo: (todoList, text) => {
    return (function toggleIn(array) {
      array.forEach(function (currentTodo) {
        //base case
        if (currentTodo.text === text) {
          currentTodo.completed = !currentTodo.completed;
          let shouldToggle = currentTodo.completed;
          //toggle children recursive case
          if (currentTodo.subTodo !== null) {
            (function toggleAllChildren(child) {
              child.forEach(function (currentChild) {
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
    })(todoList);
  },
  toggleAll: todoList => {
    //use 'every' to determine if all todos are toggled
    let areAllToggled = (function findIncompleteTodo(array) {
      return array.every(function (currentTodo) {
        //base case
        //if even one of the todos is not complete, set areAllToggled to false
        if (currentTodo.completed === false) return false;
        //recursive case
        if (currentTodo.subTodo !== null) {
          findIncompleteTodo(currentTodo.subTodo);
          return true;
        }
      });
    })(todoList);

    //use 'forEach' to set all todos to either complete or non-complete
    (function toggleAllIn(array) {
      array.forEach(function (currentTodo) {
        //base case
        currentTodo.completed = !areAllToggled;
        //recursive case
        if (currentTodo.subTodo !== null) {
          return toggleAllIn(currentTodo.subTodo);
        }
      });
    })(todoList);
  },
  totalTodos: todoList => {
    let counter = 0;
    return (function countIn(array) {
      array.forEach(function (currentTodo) {
        counter++;
        //recursive case
        if (currentTodo.subTodo !== null) {
          return countIn(currentTodo.subTodo);
        }
        //base case
        return;
      });
      return counter;
    })(todoList);
  }
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

function constructTodoComponent(text, parentText) {
  //create todo div to create consistent todo styling
  let todoLI = document.createElement('li');
  todoLI.className = 'todo';
  todoLI.dataset.parent = parentText;

  let todoText = document.createElement('div');
  todoText.className = 'todo-text';

  //create checkbox and insert it into todo-text div
  let toggleCheckbox = document.createElement('input');
  toggleCheckbox.type = 'checkbox';
  toggleCheckbox.id = 'toggle';
  todoText.appendChild(toggleCheckbox);

  //create todo text label and insert it into todo-text div
  let todo = document.createElement('label');
  //HACK: unknown cause of label text closer to checkbox when created through model function
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

function constructSubTodoList(/*parentElement*/) {
  let subTodoList = document.createElement('ul');
  subTodoList.className = 'sub-todo-list';
  // subTodoList.dataset.parentElement = parentElement;
  return subTodoList;
}

function insertTodo(text, parentText, parent_node) {
  let newTodo = constructTodoComponent(text, parentText);
  parent_node.insertAdjacentElement('beforeend', newTodo);
}

function placeInside(child_node, parent_node) {
  parent_node.insertAdjacentElement('beforeend', child_node);
}

function placeNextTo(child_node, parent_node) {
  parent_node.insertAdjacentElement('afterend', child_node);
}

inDevelopment.render = function () {
  //grab master todo list and create container div
  let app = document.getElementById('app');

  let todoContainer = constructContainer();
  let virtualDOM = constructTodoList();
  //copy virtualDOM to hold position in recursion
  let currentContainer = virtualDOM;

  (function constructDOM(fromArray, subTodoContainer) {

    fromArray.forEach(function (currentTodo) {

      //do we need to place this before the if or will closures handle it?
      insertTodo(currentTodo.text, currentTodo.parent, currentContainer);

      if (currentTodo.subTodo === null) {
        //base case
        currentContainer = currentContainer; //don't modify
        //don't recurse; carry on forEach iteration
      } else {
        //recursive case
        let newSubContainer = constructSubTodoList();

        if(currentContainer.className === "sub-todo-list") {
          placeInside(newSubContainer, currentContainer);
          currentContainer = currentContainer.lastChild;
        } else {
          placeInside(newSubContainer, virtualDOM.lastChild);
          let child_nodes = virtualDOM.lastChild.childNodes;
          let last = child_nodes.length - 1;
          currentContainer = child_nodes[last];
        }
      
        // placeNextTo(newSubContainer, virtualDOM.lastChild);


        return constructDOM(currentTodo.subTodo, currentContainer.lastChild);
      }

    });
  })(model.$root);

  console.log(app);
  placeInside(virtualDOM, todoContainer);
  placeInside(todoContainer, app);
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

