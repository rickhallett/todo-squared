//feed example data to browser console
// controller.insertTodo(model.$root, 'Master watchandcode');
// controller.insertTodo(model.$root, 'Become a Javascript ninja');
// controller.insertTodo(model.$root, 'Overthrow Gordon');
// controller.insertTodo(
//   model.$root,
//   'Roll up him in a yoga mat',
//   'Overthrow Gordon'
// );
// controller.insertTodo(
//   model.$root,
//   'consider reviewing some videos',
//   'Master watchandcode'
// );
// controller.insertTodo(
//   model.$root,
//   'get a javascript developer job',
//   'Become a Javascript ninja'
// );
// controller.insertTodo(
//   model.$root,
//   'prototype nested todo list',
//   'Become a Javascript ninja'
// );
// controller.insertTodo(
//   model.$root,
//   'complete BYOA',
//   'Become a Javascript ninja'
// );
// controller.insertTodo(
//   model.$root,
//   'master vue.js',
//   'Become a Javascript ninja'
// );
// controller.insertTodo(model.$root, 'complete tutorial', 'master vue.js');
// controller.insertTodo(model.$root, 'read documentation', 'master vue.js');
// controller.insertTodo(model.$root, 'implement TodoSquared', 'master vue.js');
// controller.insertTodo(
//   model.$root,
//   'build a robust web app',
//   'get a javascript developer job'
// );
// controller.toggleTodo(model.$root, 'prototype nested todo list');
// controller.toggleTodo(model.$root, 'read documentation');

controller.insertTodo(model.$root, 'Hello world!');
controller.insertTodo(model.$root, 'Hello Javascript!');
controller.insertTodo(model.$root, 'Hello Python!');
controller.insertTodo(model.$root, 'How are you?', 'Hello world!');
controller.insertTodo(model.$root, 'I am bangin', 'How are you?');
controller.insertTodo(model.$root, 'Lets do it.', 'Hello world!');

// controller.insertTodo(model.$root, 'Root 1');
// controller.insertTodo(model.$root, 'Root 2');
// controller.insertTodo(model.$root, 'Root 3');
// controller.insertTodo(model.$root, 'Root 1 - Sub 1', 'Root 1');
// controller.insertTodo(model.$root, 'Sub 1 - Sub 1', 'Root 1 - Sub 1');
// controller.insertTodo(model.$root, 'Root 1 - Sub 2', 'Root 1');

console.log(model.$root);
view.consoleRender(model.$root);
inDevelopment.render(model.$root);