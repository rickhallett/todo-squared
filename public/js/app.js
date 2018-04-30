
/*
Project Todo List:
1. HTAQ-Lockdown mode
2. Export data as json
3. Import data as json
4. Filter display by all/active/completed
5. Play around with workflowy to get more inspiration
6. Have a way of shifting todos by parent or vertical
7. Recursive optimisation: if operation is completed, prevent further recursion (just for practice)
8. Make the easter egg text recognition more sophisticated (i.e. particular word combinations)
*/

//globals
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

let HTAQ_JSON = JSON.parse( HTAQ );
let STOCK_JSON = JSON.parse( stock );

const APP_STATE = {
  lockdown: false,
  userData: ''
}

function lockdown() {
  APP_STATE.lockdown = true;
  APP_STATE.userData = cloneDeep( model.$root );;
  model.$root = HTAQ_JSON;
  view.render( model.$root );
}

function removeLockdown() {
  APP_STATE.lockdown = false;
  model.$root = APP_STATE.userData;
  HTAQ_JSON = JSON.parse( HTAQ );
  view.render( model.$root );
}

window.onload = function () {
  utils.setupConsole();
  model.$root = utils.store( 'todo-squared' );
  view.render( model.$root );
}



