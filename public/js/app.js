
/*
Project Todo List:
1. 
*/

//globals
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

window.onload = function() {
  utils.setupConsole();
  seedData();
  view.render( model.$root );
}



