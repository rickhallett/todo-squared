/*
Todo List:
1. Escape the console
*/

// =================================
//        escape the console
// =================================

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

class TodoList {
  constructor() {
    this.$root = [];
  }
}

class Todo {
  constructor( text, parent ) {
    this.id = utils.generateID();
    this.parent = parent || '$root';
    this.text = text;
    this.completed = false;
    this.dateCreated = new Date();
    this.subTodo = null;
  }

  edit( text ) {
    this.text = text;
    this.dateModified = new Date();
  }
}

let utils = {
  init: () => {
    // model.$root = utils.store('todo-squared');
    utils.setupConsole();
    seedData();
    view.render( model.$root );
  },
  setupConsole: () => {
    const commands = {
      ins: controller.insertTodo.bind( null, model.$root ),
      del: controller.deleteTodo.bind( null, model.$root ),
      edit: controller.editTodo.bind( null, model.$root ),
      tog: controller.toggleTodo.bind( null, model.$root ),
      togall: controller.toggleAll.bind( null, model.$root )
    }
    window.app = commands;
  },
  //NB: necessary to preserve as function declaration over arrow function as arrow function doesn't preserve arguments variable
  store: function ( namespace, data ) {
    if ( arguments.length > 1 ) {
      return localStorage.setItem( namespace, JSON.stringify( data ) );
    } else {
      var store = localStorage.getItem( namespace );
      return ( store && JSON.parse( store ) ) || [];
    }
  },
  generateID: () => {
    const ALPHABET =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const ID_LENGTH = 8;
    let rtn = '';
    for ( let i = 0; i < ID_LENGTH; i++ ) {
      rtn += ALPHABET.charAt( Math.floor( Math.random() * ALPHABET.length ) );
      if ( i === 2 || i === 5 ) {
        rtn += '-';
      }
    }
    return rtn;
  },
  pluralize: ( count, word ) => {
    return count === 1 ? word : word + 's';
  },
  exitIfEqual: ( originalModel, alteredModel, functionType ) => {
    if ( _.isEqual( originalModel, model.$root ) ) {
      console.log( `%c${ functionType } was unsuccessful`, "color: red" );
      return true;
    }
    return void 0;
  }
}

let model = new TodoList();

let controller = {
  //BUG: editTodo will change all todos that have indentical text
  //proposed solution: find todo by id and delete by id
  //proposed solution: count todos that have identical text and if > 1 then prompt user to define parent todo text name
  //:bug: change child parents on edit
  editTodo: ( todoList, id, newText ) => {
    // let originalModel = utils.cloneDeep( model.$root );
    let originalModel = cloneDeep( model.$root );

    ( function editIn( array ) {
      array.forEach( function ( currentTodo ) {
        //base case
        if ( currentTodo.id === id ) {
          currentTodo.edit( newText );
          console.clear();
          console.log( `"${ id }" was edited to "${ newText }"` );
        }
        //recursive case
        if ( currentTodo.subTodo !== null ) {
          return editIn( currentTodo.subTodo );
        }
      } );
    } )( todoList )

    if ( utils.exitIfEqual( originalModel, model.$root, 'edit' ) ) return void 0;

    view.render();
    view.consoleRender( model.$root );
  },
  //TO ADD: find multiple matching todo texts if exist
  //USE CASE: controller.findTodo(model.$root, 'find this todo');
  findTodo: ( todoList, text ) => {
    let foundTodo;
    ( function findIn( array ) {
      array.forEach( function ( currentTodo ) {
        //base case
        if ( currentTodo.text === text ) {
          foundTodo = currentTodo;
          return void 0;
        }
        //recursive case
        if ( currentTodo.subTodo !== null ) {
          return findIn( currentTodo.subTodo );
        }
      } );
      return foundTodo;
    } )( todoList );
  },
  //USE CASE: controller.findTodo(model.$root, 'find this todo');
  insertTodo: ( todoList, text, parent ) => {
    let originalModel = cloneDeep( model.$root );
    if ( parent ) {
      ( function insertIn( array ) {
        array.forEach( function ( currentTodo ) {
          //base case
          if ( currentTodo.text === parent ) {
            //if no array, initialise array
            if ( currentTodo.subTodo === null ) {
              currentTodo.subTodo = [];
            }
            currentTodo.subTodo.push( new Todo( text, parent ) );
            console.clear();
            console.log( `"${ text }" was inserted at "${ parent }"` );
            return void 0;
          }
          //recursive case
          if ( currentTodo.subTodo !== null ) {
            return insertIn( currentTodo.subTodo );
          }
        } );
      } )( todoList );
    } else {
      todoList.push( new Todo( text ) );
      //make sure model is updated (due to setupApp copying model)
      // model.$root = todoList;
      console.clear();
      console.log( `"${ text }" was inserted at $root` );
    }

    if ( utils.exitIfEqual( originalModel, model.$root, 'insert' ) ) return void 0;

    view.render();
    view.consoleRender( model.$root );
  },
  deleteTodo: ( todoList, id ) => {
    let originalModel = cloneDeep( model.$root );
    let ancestors = [];
    ( function deleteIn( array ) {
      array.forEach( function ( currentTodo ) {
        //base case
        if ( currentTodo.id === id ) {
          if ( currentTodo.parent === '$root' ) {
            let index = array.indexOf( currentTodo );
            array.splice( index, 1 );
            console.clear();
            console.log( `"${ id }" was deleted from $root` );
          } else {
            let lastAncestor = ancestors[ ancestors.length - 1 ];
            let index = lastAncestor.subTodo.indexOf( currentTodo );
            lastAncestor.subTodo.splice( index, 1 );
            console.clear();
            console.log( `"${ id }" was deleted from "${ lastAncestor.text }"` );
          }
          return void 0;
        }
        //recursive case
        if ( currentTodo.subTodo !== null ) {
          //store previous todo for deletion
          // previousTodo = currentTodo;
          ancestors.push( currentTodo );
          return deleteIn( currentTodo.subTodo );
        }
      } );
      ancestors.pop();
    } )( todoList );

    if ( utils.exitIfEqual( originalModel, model.$root, 'delete' ) ) return void 0;

    view.render();
    view.consoleRender( model.$root );
  },
  toggleTodo: ( todoList, id ) => {
    ( function toggleIn( array ) {
      array.forEach( function ( currentTodo ) {
        //base case
        if ( currentTodo.id === id ) {
          currentTodo.completed = !currentTodo.completed;
          let shouldToggle = currentTodo.completed;
          //toggle children recursive case
          if ( currentTodo.subTodo !== null ) {
            ( function toggleAllChildren( child ) {
              child.forEach( function ( currentChild ) {
                currentChild.completed = shouldToggle;
                if ( currentChild.subTodo !== null ) {
                  toggleAllChildren( currentChild.subTodo );
                }
              } );
            } )( currentTodo.subTodo );
          }
          return void 0;
        }
        //single nested recursive case
        if ( currentTodo.subTodo !== null ) {
          return toggleIn( currentTodo.subTodo );
        }
      } );
    } )( todoList );
    console.clear();
    view.render();
    view.consoleRender( model.$root );
  },
  toggleAll: todoList => {
    //use 'every' to determine if all todos are toggled
    let areAllToggled = ( function findIncompleteTodo( array ) {
      return array.every( function ( currentTodo ) {
        //base case
        //if even one of the todos is not complete, set areAllToggled to false
        if ( currentTodo.completed === false ) return false;
        //recursive case
        if ( currentTodo.subTodo !== null ) {
          findIncompleteTodo( currentTodo.subTodo );
          return true;
        }
      } );
    } )( todoList );

    //use 'forEach' to set all todos to either complete or non-complete
    ( function toggleAllIn( array ) {
      array.forEach( function ( currentTodo ) {
        //base case
        currentTodo.completed = !areAllToggled;
        //recursive case
        if ( currentTodo.subTodo !== null ) {
          return toggleAllIn( currentTodo.subTodo );
        }
      } );
    } )( todoList );
    console.clear();
    view.render();
    view.consoleRender( model.$root );
  },
  totalTodos: todoList => {
    let counter = 0;
    return ( function countIn( array ) {
      array.forEach( function ( currentTodo ) {
        counter++;
        //recursive case
        if ( currentTodo.subTodo !== null ) {
          return countIn( currentTodo.subTodo );
        }
        //base case
        return void 0;
      } );
      return counter;
    } )( todoList );
  }
};

let view = {
  consoleRender: todoList => {
    let totalTodos = controller.totalTodos( todoList );
    let itemString = utils.pluralize( totalTodos, 'item' );
    console.log( `\nTodoList: ${ totalTodos } ${ itemString }.\n \n` );
    let indentation = 0;
    ( function print( array ) {
      array.forEach( function ( currentTodo, index ) {
        let spaces = '';
        let completedMark = '( )';
        for ( let i = 1; i <= indentation; i++ ) {
          spaces += '     ';
        }
        if ( currentTodo.completed === true ) {
          completedMark = '(x)';
        }
        console.log(
          `${ completedMark }${ spaces } ${ index + 1 } ${ currentTodo.text }`
        );
        //recursive case
        if ( currentTodo.subTodo !== null ) {
          indentation++;
          return print( currentTodo.subTodo );
        }
        return void 0;
      } );
      indentation--;
    } )( todoList );
    utils.store( 'todo-squared', model.$root );
    console.log( model.$root );
  },
  render: () => {
    //grab master todo list
    let app = document.getElementById( 'app' );
    ///delete current DOM
    app.innerHTML = '';
    //create container div
    let todoContainer = view.constructContainer();
    //allocate memory for construction of HTML
    let virtualDOM = view.constructTodoList();
    //copy virtualDOM to hold position in recursion (for readability)
    let currentContainer = virtualDOM;
    let previousTodo;
    let ancestorPath = [];
    ancestorPath.push( currentContainer );

    ( function constructDOM( fromArray ) {
      fromArray.forEach( function ( currentTodo, index ) {
        //if function has returned to root level, ensure ancestorPath is also reset
        if ( currentTodo.parent === '$root' ) {
          ancestorPath = ancestorPath.slice( 0, 1 );
          //reset current container to todo app container
          currentContainer = ancestorPath[ 0 ];
        }
        let lastAncestor = ancestorPath[ ancestorPath.length - 1 ];
        view.insertTodo( currentTodo, lastAncestor );

        //recursive case
        if ( currentTodo.subTodo !== null ) {
          let newSubContainer = view.constructSubTodoList();
          view.placeInside( newSubContainer, lastAncestor );
          //add next depth to record
          currentContainer = currentContainer.lastChild;
          ancestorPath.push( currentContainer );
          return constructDOM( currentTodo.subTodo );
        }

        //base case
        //after returning from recursion (ie moving up one depth), pop ancestorPath
        //guard against popping if not at the end of subTodos array
        if ( index === fromArray.length - 1 ) {
          currentContainer = currentContainer.parentNode;
          if ( ancestorPath.length > 1 ) return ancestorPath.pop();
          return void 0;
        }

      } );
    } )( model.$root );

    view.placeInside( virtualDOM, todoContainer );
    view.placeInside( todoContainer, app );
    utils.store( 'todo-squared', model.$root );
  },
  setupEventListeners: () => {

  },
  constructContainer: () => {
    //create container div for app
    let todoContainer = document.createElement( 'div' );
    todoContainer.className = 'todoContainer';

    //create div to contain header elements
    let header = document.createElement( 'div' );
    header.id = 'header';

    let toggleAllIcon = document.createElement( 'i' );
    toggleAllIcon.className = 'fas fa-angle-down fa-2x toggle-all';
    header.appendChild( toggleAllIcon );

    let input = document.createElement( 'input' );
    input.id = 'enter';
    input.placeholder = 'What would you like todo?';
    header.appendChild( input );

    let addTodoButton = document.createElement( 'button' );
    addTodoButton.id = 'add-todo';
    addTodoButton.textContent = 'Add Todo';
    header.appendChild( addTodoButton );

    todoContainer.appendChild( header );
    return todoContainer;
  },
  constructTodoComponent: ( todo ) => {
    //create todo div to create consistent todo styling
    let todoLI = document.createElement( 'li' );
    todoLI.className = 'todo';
    todoLI.dataset.name = todo.text;
    todoLI.dataset.id = todo.id;

    let todoText = document.createElement( 'div' );
    todoText.className = 'todo-text';

    //create checkbox and insert it into todo-text div
    let toggleCheckbox = document.createElement( 'input' );
    toggleCheckbox.type = 'checkbox';
    toggleCheckbox.checked = todo.completed;
    toggleCheckbox.className = 'toggle';

    toggleCheckbox.addEventListener( 'click', function () {
      controller.toggleTodo( model.$root, todo.id );
    } );

    todoText.appendChild( toggleCheckbox );

    //create checkbox and insert it into todo-text div
    let expander = document.createElement( 'label' );
    // expandCheckbox.type = 'checkbox';
    expander.innerText = '+';
    expander.className = 'expander';
    todoText.appendChild( expander );

    //create todo text label and insert it into todo-text div
    let todoLabel = document.createElement( 'label' );
    //HACK: unknown cause of label text closer to checkbox when created through model function
    todoLabel.textContent = ' ' + todo.text;

    //create editInput, set default to hide and also insert to todo-text div
    let editInput = document.createElement( 'input' );
    editInput.className = 'edit-input';
    editInput.maxLength = 35;
    editInput.style.display = 'none'

    function showInput( event ) {
      event.target.style.display = 'none';
      editInput.style.display = 'inline';
    }

    function showTodo() {
      editInput.style.display = 'none';
      todo.style.display = 'inline';
    }

    todoLabel.addEventListener( 'dblclick', function ( event ) {
      let textToEdit = todoLabel.innerText;
      showInput( event );
      editInput.value = textToEdit;
      editInput.focus();
    } );

    editInput.addEventListener( 'keydown', function ( event ) {
      if ( event.which === ESCAPE_KEY ) {
        showTodo();
      }
      if ( event.which === ENTER_KEY ) {
        let newText = editInput.value;
        newText.trim();
        controller.editTodo( model.$root, id, newText );
      }
    } );

    editInput.addEventListener( 'blur', function () {
      if ( editInput.value.length < 1 ) {
        showTodo();
      } else {
        let newText = editInput.value;
        newText.trim();
        controller.editTodo( model.$root, id, newText );
      }
    } );

    todoText.appendChild( todoLabel );
    todoText.appendChild( editInput );

    //insert compound todo-text div into parent todo div
    todoLI.appendChild( todoText );

    //create destroy button and insert it into parent todo div
    let destroyButton = document.createElement( 'button' );
    destroyButton.className = 'destroy';
    destroyButton.textContent = 'x';

    destroyButton.addEventListener( 'click', function ( event ) {
      controller.deleteTodo( model.$root, id );
    } );

    todoLI.appendChild( destroyButton );

    return todoLI;
  },
  constructTodoList: () => {
    let todoList = document.createElement( 'ul' );
    todoList.className = 'todo-list';

    return todoList;
  },
  constructSubTodoList: () => {
    let subTodoList = document.createElement( 'ul' );
    subTodoList.className = 'sub-todo-list';
    return subTodoList;
  },
  insertTodo: ( todo, parent_node ) => {
    let newTodo = view.constructTodoComponent( todo );
    parent_node.insertAdjacentElement( 'beforeend', newTodo );
  },
  placeInside: ( child_node, parent_node ) => {
    parent_node.insertAdjacentElement( 'beforeend', child_node );
  }
};

utils.init();



