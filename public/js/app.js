
/*
Project Todo List:
1. 
*/

//globals
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

window.onload = function() {
  utils.setupConsole();
  // seedData();
  model.$root = utils.store('todo-squared');
  view.render( model.$root );
}



