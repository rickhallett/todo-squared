const generate = function() {
  const ALPHABET =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const ID_LENGTH = 8;
  let rtn = '';
  for (let i = 0; i < ID_LENGTH; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    if (i === 2 || i === 5) {
      rtn += '-';
    }
  }
  return rtn;
};

//feed example data to browser console
let $todoList = new TodoList();
$todoList.insertTodo('Master watchandcode');
$todoList.insertTodo('Become a Javascript ninja');
$todoList.insertTodo('Overthrow Gordon');
$todoList.insertTodo('climb the student ranks', 'Overthrow Gordon');
$todoList.insertTodo('consider reviewing some videos', 'Master watchandcode');
$todoList.insertTodo(
  'get a javascript developer job',
  'Become a Javascript ninja'
);
$todoList.insertTodo('prototype nested todo list', 'Become a Javascript ninja');
$todoList.insertTodo('complete BYOA', 'Become a Javascript ninja');
$todoList.insertTodo('master vue.js', 'Become a Javascript ninja');
$todoList.insertTodo('complete tutorial', 'master vue.js');
$todoList.insertTodo('read documentation', 'master vue.js');
$todoList.insertTodo('implement TodoSquared', 'master vue.js');
$todoList.insertTodo(
  'build a robust web app',
  'get a javascript developer job'
);
$todoList.toggleTodo('climb the student ranks');
$todoList.toggleTodo('prototype nested todo list');
$todoList.toggleTodo('read documentation');
