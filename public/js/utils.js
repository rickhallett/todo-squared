const utils = {
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