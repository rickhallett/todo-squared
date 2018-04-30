const view = {
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
        let todoContainer = components.constructContainer();
        //allocate memory for construction of HTML
        let tempDOM = components.constructTodoList();
        //copy virtualDOM to hold position in recursion (for readability)
        let currentContainer = tempDOM;
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
                components.insertTodo( currentTodo, lastAncestor );

                //recursive case
                if ( currentTodo.subTodo !== null && currentTodo.isExpanded === true ) {
                    let newSubContainer = components.constructSubTodoList();
                    components.placeInside( newSubContainer, lastAncestor );
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

        components.placeInside( tempDOM, todoContainer );
        components.placeInside( todoContainer, app );
        utils.store( 'todo-squared', model.$root );
    }
}
