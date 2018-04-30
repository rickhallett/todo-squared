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
                if ( currentTodo.subTodo !== null && currentTodo.isExpanded === true ) {
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
    constructContainer: () => {
        //create container div for app
        let todoContainer = document.createElement( 'div' );
        todoContainer.className = 'todoContainer';

        //create div to contain header elements
        let header = document.createElement( 'div' );
        header.id = 'header';

        let toggleAllIcon = document.createElement( 'img' );
        toggleAllIcon.src = './public/img/angle-down.svg';
        toggleAllIcon.id = 'toggle-all';

        toggleAllIcon.addEventListener( 'click', function () {
            controller.toggleAll( model.$root );
        } );

        header.appendChild( toggleAllIcon );

        let input = document.createElement( 'input' );
        input.id = 'enter';
        input.placeholder = 'What would you like todo?';

        function getValueAndInsert() {
            let newTodo = input.value;
            if ( newTodo.length > 0 ) {
                newTodo.trim();
                let parent = controller.findActiveTodo( model.$root );
                parent.isExpanded = true;
                controller.insertTodo( model.$root, newTodo, parent.text );
            } else {
                removeFocusAndReset();
            }
        }

        function removeFocusAndReset() {
            input.value = '';
            input.placeholder = 'What would you like todo?';
            input.blur();
        }

        input.addEventListener( 'keydown', function ( event ) {
            if ( event.which === ENTER_KEY ) {
                getValueAndInsert();
            }

            if ( event.which === ESCAPE_KEY ) {
                removeFocusAndReset();
            }

        } );

        input.addEventListener( 'blur', function () {
            if ( addTodoButton.preventBlur === false ) removeFocusAndReset();
        } );

        header.appendChild( input );

        let addTodoButton = document.createElement( 'button' );
        addTodoButton.id = 'add-todo';
        addTodoButton.textContent = 'Add Todo';
        addTodoButton.preventBlur = false;

        addTodoButton.addEventListener( 'mouseover', function () {
            addTodoButton.preventBlur = true;
        } );

        addTodoButton.addEventListener( 'mouseleave', function () {
            addTodoButton.preventBlur = false;
        } );

        addTodoButton.addEventListener( 'click', function () {
            getValueAndInsert();
        } );

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
        expander.innerText = todo.subTodo ? '+' : '-';
        expander.className = 'expander';

        expander.addEventListener( 'click', function () {
            todo.toggleExpand();
            view.render();
        } );

        todoText.appendChild( expander );

        //create todo text label and insert it into todo-text div
        let todoLabel = document.createElement( 'label' );
        //HACK: unknown cause of label text closer to checkbox when created through model function
        todoLabel.textContent = ' ' + todo.text;
        todoLabel.className = todo.isActive ? 'active' : 'inactive';

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

        let timer = 0;
        let delay = 200;
        let prevent = false;

        todoLabel.addEventListener( 'click', function () {
            //very slight delay on firing off the normal click action, which cancels when the double click event happens (prevents conflict)
            timer = setTimeout( function () {
                if ( !prevent ) {
                    if ( todo.isActive === false ) controller.deactivateAll( model.$root, todo.id );
                    todo.toggleActive();
                    view.render();
                }
            }, delay );
        } );

        todoLabel.addEventListener( 'dblclick', function ( event ) {
            clearTimeout( timer );
            prevent = true;

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
                controller.editTodo( model.$root, todo.id, newText );
            }
        } );

        editInput.addEventListener( 'blur', function () {
            if ( editInput.value.length < 1 ) {
                showTodo();
            } else {
                let newText = editInput.value;
                newText.trim();
                controller.editTodo( model.$root, todo.id, newText );
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
            controller.deleteTodo( model.$root, todo.id );
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