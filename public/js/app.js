/*
Todo List:
1. Escape the console
*/

// =================================
//        escape the console
// =================================

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

let inDevelopment = {};

let utils = {
  //NB: necessary to preserve as function declaration over arrow function as arrow function doesn't preserve arguments variable
  store: function( namespace, data ) {
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
  clone: ( val, deep ) => {
    switch ( typeof ( val ) ) {
      case 'array':
        return val.slice();
      case 'object':
        return Object.assign( {}, val );
      default: {
        return val;
      }
    }
  },
  //NB: remove instanceClone functionality if not needed
  cloneDeep: ( val, instanceClone ) => {
    switch ( typeof ( val ) ) {
      case 'object':
        return this.cloneObjectDeep( val, instanceClone );
      case 'array':
        return this.cloneArrayDeep( val, instanceClone );
      default: {
        return clone( val );
      }
    }
  },
  cloneObjectDeep: ( val, instanceClone ) => {
    if ( typeof instanceClone === 'function' ) {
      return instanceClone( val );
    }
    if ( typeof ( val ) === 'object' ) {
      const res = new val.constructor();
      for ( const key in val ) {
        res[ key ] = this.cloneDeep( val[ key ], instanceClone );
      }
      return res;
    }
    return val;
  },
  cloneArrayDeep: ( val, instanceClone ) => {
    const res = new val.constructor( val.length );
    for ( let i = 0; i < val.length; i++ ) {
      res[ i ] = this.cloneDeep( val[ i ], instanceClone );
    }
    return res;
  },
  pluralize: ( count, word ) => {
    return count === 1 ? word : word + 's';
  },
}



let model = new TodoList();

let controller = {
  editTodo: ( todoList, text, newText ) => {

    ( function editIn( array ) {
      array.forEach( function ( currentTodo ) {
        //base case
        if ( currentTodo.text === text ) {
          currentTodo.edit( newText );
          console.clear();
          console.log( `"${ text }" was edited to "${ newText }"` );
        }
        //recursive case
        if ( currentTodo.subTodo !== null ) {
          return editIn( currentTodo.subTodo );
        }
      } );
    } )( todoList );

    console.log( model.$root );
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
      console.clear();
      console.log( `"${ text }" was inserted at $root` );
    }
    console.log( model.$root );
    view.consoleRender( model.$root );
  },
  deleteTodo: ( todoList, text ) => {
    let ancestors = [];
    ( function deleteIn( array ) {
      array.forEach( function ( currentTodo ) {
        //base case
        if ( currentTodo.text === text ) {
          if ( currentTodo.parent === '$root' ) {
            let index = array.indexOf( currentTodo );
            array.splice( index, 1 );
            console.clear();
            console.log( `"${ text }" was deleted from $root` );
          } else {
            let lastAncestor = ancestors[ ancestors.length - 1 ];
            let index = lastAncestor.subTodo.indexOf( currentTodo );
            lastAncestor.subTodo.splice( index, 1 );
            console.clear();
            console.log( `"${ text }" was deleted from "${ lastAncestor.text }"` );
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
    console.log( model.$root );
    view.consoleRender( model.$root );
  },
  toggleTodo: ( todoList, text ) => {
    ( function toggleIn( array ) {
      array.forEach( function ( currentTodo ) {
        //base case
        if ( currentTodo.text === text ) {
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
    console.log( model.$root );
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
    console.log( model.$root );
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
  },
  render: () => {
    //grab master todo list and create container div
    let app = document.getElementById( 'app' );
    let todoContainer = view.constructContainer();

    //allocate memory for construction of HTML
    let virtualDOM = view.constructTodoList();

    //copy virtualDOM to hold position in recursion (for readability)
    let currentContainer = virtualDOM;
    let previousTodo;

    ( function constructDOM( fromArray ) {
      fromArray.forEach( function ( currentTodo ) {
        let v = virtualDOM;

        //check for root depth to over-ride step by step depth finding
        if ( currentTodo.parent === '$root' ) {
          currentContainer = virtualDOM;
        }

        view.insertTodo( currentTodo.text, currentTodo.id, currentContainer );

        //base case
        if ( currentTodo.subTodo === null ) {
          //move container pointer up one level to accommodate further todos at this depth
          //use if to prevent moving up level at $root node
          if ( currentContainer.parentNode !== null ) {
            //if SOMETHING, don't move pointer up

            //step-by-step depth finding
            if ( previousTodo.parent === currentTodo.parent ) {
              currentContainer = currentContainer;
            } else if ( previousTodo.text === currentTodo.parent ) {
              currentContainer = currentContainer;
            } else {
              currentContainer = currentContainer.parentNode;
            }
          }

          //recursive case
        } else {

          let newSubContainer = view.constructSubTodoList();
          view.placeInside( newSubContainer, currentContainer );

          //move container pointer down one level to accommodate recursion
          currentContainer = currentContainer.lastChild;

          //store pointer to this todo and traverse into subTodos
          previousTodo = currentTodo;
          return constructDOM( currentTodo.subTodo );
        }

      } );

    } )( model.$root );

    console.log( app );
    view.placeInside( virtualDOM, todoContainer );
    view.placeInside( todoContainer, app );
    utils.store( 'todo-squared', model.$root );
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
  constructTodoComponent: ( text, id ) => {
    //create todo div to create consistent todo styling
    let todoLI = document.createElement( 'li' );
    todoLI.className = 'todo';
    todoLI.dataset.id = id;

    let todoText = document.createElement( 'div' );
    todoText.className = 'todo-text';

    //create checkbox and insert it into todo-text div
    let toggleCheckbox = document.createElement( 'input' );
    toggleCheckbox.type = 'checkbox';
    toggleCheckbox.id = 'toggle';
    todoText.appendChild( toggleCheckbox );

    //create todo text label and insert it into todo-text div
    let todo = document.createElement( 'label' );
    //HACK: unknown cause of label text closer to checkbox when created through model function
    todo.textContent = ' ' + text;
    todoText.appendChild( todo );

    //insert compound todo-text div into parent todo div
    todoLI.appendChild( todoText );

    //create destroy button and insert it into parent todo div
    let destroyButton = document.createElement( 'button' );
    destroyButton.className = 'destroy';
    destroyButton.textContent = 'x';
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
  insertTodo: ( text, id, parent_node ) => {
    let newTodo = view.constructTodoComponent( text, id );
    parent_node.insertAdjacentElement( 'beforeend', newTodo );
  },
  placeInside: ( child_node, parent_node ) => {
    parent_node.insertAdjacentElement( 'beforeend', child_node );
  }
};

/*
if (node.parentNode) {
  // remove a node from the tree, unless
  // it's not in the tree already
  node.parentNode.removeChild(node);
}
*/


