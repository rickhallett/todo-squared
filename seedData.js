//feed example data to browser console
controller.insertTodo(model.$root, 'Master watchandcode');
controller.insertTodo(model.$root, 'Become a Javascript ninja');
controller.insertTodo(model.$root, 'Overthrow Gordon');
controller.insertTodo(model.$root, 'Achieve enlightenment');
controller.insertTodo(
  model.$root,
  'Roll up him in a yoga mat',
  'Overthrow Gordon'
);
controller.insertTodo(
  model.$root,
  'consider reviewing some videos',
  'Master watchandcode'
);
controller.insertTodo(
  model.$root,
  'get a javascript developer job',
  'Become a Javascript ninja'
);
controller.insertTodo(
  model.$root,
  'prototype nested todo list',
  'Become a Javascript ninja'
);
controller.insertTodo(
  model.$root,
  'complete BYOA',
  'Become a Javascript ninja'
);
controller.insertTodo(
  model.$root,
  'master vue.js',
  'Become a Javascript ninja'
);
controller.insertTodo(model.$root, 'complete tutorial', 'master vue.js');
controller.insertTodo(model.$root, 'read documentation', 'master vue.js');
controller.insertTodo(model.$root, 'implement TodoSquared', 'master vue.js');
controller.insertTodo(
  model.$root,
  'build a robust web app',
  'get a javascript developer job'
);
controller.insertTodo(model.$root, 'contribute to Gordons eslint plugin', 'Master watchandcode');
controller.insertTodo(model.$root, 'get some interviews!', 'get a javascript developer job');
controller.toggleTodo(model.$root, 'prototype nested todo list');
controller.toggleTodo(model.$root, 'read documentation');

console.log(model.$root);
view.consoleRender(model.$root);
view.render(model.$root);