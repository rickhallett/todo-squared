const controller = {
    //BUG: editTodo will change all todos that have indentical text within console commands
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
                    currentTodo.text = newText;
                    currentTodo.dateModified = new Date();
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
    findActiveTodo: ( todoList ) => {
        let foundTodo;
        ( function findIn( array ) {
            array.forEach( function ( currentTodo ) {
                //base case
                if ( currentTodo.isActive === true ) {
                    foundTodo = currentTodo;
                }
                //recursive case
                if ( currentTodo.subTodo !== null ) {
                    return findIn( currentTodo.subTodo );
                }
            } );
        } )( todoList );
        if ( foundTodo ) return foundTodo;
        return void 0;
    },
    deactivateAll: ( todoList, id ) => {
        ( function deactivate( array ) {
            array.forEach( function ( currentTodo ) {
                //base case
                currentTodo.isActive = false;
                //recursive case
                if ( currentTodo.subTodo !== null ) {
                    return deactivate( currentTodo.subTodo );
                }
            } );
        } )( todoList );
    },
    clearCompleted: ( todoList ) => {
        let completedTodos = [];
        //get IDs of checked todos
        ( function getIDs( array ) {
            array.forEach( ( todo ) => {
                //base case
                if ( todo.completed === true ) completedTodos.push( todo.id );

                //recursive case
                if ( todo.subTodo !== null ) return getIDs( todo.subTodo );;
            } );
        } )( todoList );

        ///forEach checked todo, deleteTodo by ID
        completedTodos.forEach( id => controller.deleteTodo( todoList, id ) );
    },
    //USE CASE: controller.findTodo(model.$root, 'find this todo');
    //BUG: currently child todos are added by parent; this is vulnerable to identical parent names: switch to unique ID
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
                }
                return true;
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