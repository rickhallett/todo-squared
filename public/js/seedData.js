//feed example data to browser console
seedData = () => {
  controller.insertTodo(
    model.$root,
    'master watchandcode'
  );
  controller.insertTodo( model.$root,
    'become a javascript ninja'
  );
  controller.insertTodo( model.$root,
    'overthrow gordon'
  );
  controller.insertTodo( model.$root,
    'achieve enlightenment'
  );
  controller.insertTodo(
    model.$root,
    'roll him up in a yoga mat',
    'overthrow gordon'
  );
  controller.insertTodo(
    model.$root,
    'consider reviewing some videos',
    'master watchandcode'
  );
  controller.insertTodo(
    model.$root,
    'get a javascript developer job',
    'become a javascript ninja'
  );
  controller.insertTodo(
    model.$root,
    'prototype nested todo list',
    'become a javascript ninja'
  );
  controller.insertTodo(
    model.$root,
    'complete BYOA',
    'become a javascript ninja'
  );
  controller.insertTodo(
    model.$root,
    'master vue.js',
    'become a javascript ninja'
  );
  controller.insertTodo(
    model.$root,
    'complete tutorial',
    'master vue.js'
  );
  controller.insertTodo( model.$root,
    'read documentation',
    'master vue.js'
  );
  controller.insertTodo( model.$root,
    'implement todosquared',
    'master vue.js'
  );
  controller.insertTodo(
    model.$root,
    'build a robust web app',
    'get a javascript developer job'
  );
  controller.insertTodo( model.$root,
    'contribute to gordons eslint plugin',
    'master watchandcode'
  );
  controller.insertTodo( model.$root,
    'get some interviews!',
    'get a javascript developer job'
  );
  controller.toggleTodo(
    model.$root,
    'prototype nested todo list'
  );
  controller.toggleTodo( model.$root,
    'read documentation'
  );
}