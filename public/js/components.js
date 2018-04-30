const components = {
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
                if ( parent ) parent.isExpanded = true;
                controller.insertTodo( model.$root, newTodo, (parent ? parent.text : null) );
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
    constructFooter: () => {
        //create div to contain footer elements
        let footer = document.createElement( 'div' );
        footer.id = 'footer';

        let count = document.createElement('label');

        let totalTodos = controller.totalTodos( model.$root );
        let itemString = utils.pluralize( totalTodos, 'item' );

        count.innerText = `${totalTodos} ${itemString}`;

        footer.appendChild(count);

        let clearCompleted = document.createElement('label');
        clearCompleted.id = 'clear'
        clearCompleted.innerText = 'Clear completed';

        clearCompleted.addEventListener('click', function() {
            controller.clearCompleted();
        });

        footer.appendChild(clearCompleted);

        return footer;
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
        expander.innerText = todo.subTodo ? '+' : '';
        if(todo.isExpanded === true) expander.innerText = '-';
        expander.className = 'expander';

        expander.addEventListener( 'click', function () {
            todo.isExpanded = !todo.isExpanded;
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
                    todo.isActive = !todo.isActive;
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
        let newTodo = components.constructTodoComponent( todo );
        parent_node.insertAdjacentElement( 'beforeend', newTodo );
    },
    placeInside: ( child_node, parent_node ) => {
        parent_node.insertAdjacentElement( 'beforeend', child_node );
    }
}