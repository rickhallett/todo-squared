//feed example data to browser console
seedData = () => {
  //delete existing data
  model.$root = [];

  controller.insertTodo(
    model.$root,
    'master watchandcode'
  );
  controller.insertTodo( model.$root,
    'become js man'
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
    'become js man'
  );
  controller.insertTodo(
    model.$root,
    'prototype nested todo list',
    'become js man'
  );
  controller.insertTodo(
    model.$root,
    'complete BYOA',
    'become js man'
  );
  controller.insertTodo(
    model.$root,
    'master vue.js',
    'become js man'
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
  controller.insertTodo( model.$root,
    'if you really wanted to you could post a section of your CV here as there is no limit to the length of a todo',
    'get some interviews!'
  );
  controller.insertTodo( model.$root,
    'and record the event on youtube',
    'roll him up in a yoga mat'
  );
  controller.insertTodo( model.$root,
    'digestion techniques',
    'master watchandcode'
  );
  controller.insertTodo( model.$root,
    'get unstuck',
    'digestion techniques'
  );
  controller.insertTodo( model.$root,
    'If you\'ve put in an honest effort to figure something out but are still stuck, you must ask for help.You will not magically get unstuck.The answer will probably not come to you in your dreams.',
    'get unstuck'
  );
  controller.insertTodo( model.$root,
    'Getting help here is so exceedingly easy that you have no excuse not to. The first place to go is the #questions channel in Slack. If it\'s Monday, you should go to office hours and get an answer directly from me over video chat.If it\'s in the morning, go to the morning accountability meeting and tell the group what you\'re having trouble with. Opportunities to get unstuck are all around you.You just have to put your hand out and take them.',
    'get unstuck'
  );
  controller.insertTodo( model.$root,
    'add comments that describe each line in plain English',
    'digestion techniques'
  );
  controller.insertTodo( model.$root,
    'Translating each line of code into plain English forces you to understand everything in detail. It also makes reviewing the code easier since you can just refer to your comments in case you get stuck.',
    'add comments that describe each line in plain English'
  );
  controller.insertTodo( model.$root,
    'leave it on your desk until it bores you',
    'digestion techniques'
  );
  controller.insertTodo( model.$root,
    'Print the code on a sheet of paper and leave it on your desk. Each time you\'re bored at your desk, instead of looking at Facebook or Reddit, look at the code. Scribble notes on the parts that were tricky or confusing.',
    'leave it on your desk until it bores you'
  );
  controller.insertTodo( model.$root,
    'Keep doing this and leave the code on your desk until you\'re bored.The day you look at the code and say to yourself, "damn this is so obvious, this is for little kids", is the day that you crumple it up and toss it.You can also save it somewhere if you\'re the nostalgic type. It doesn\'t matter as long as you leave it on your desk until it bores you.',
    'leave it on your desk until it bores you'
  );
  controller.insertTodo( model.$root,
    '',
    'leave it on your desk until it bores you'
  );
  controller.insertTodo( model.$root,
    'fix every combination of 1 missing feature',
    'digestion techniques'
  );
  controller.insertTodo( model.$root,
    'For simplicity, let\'s pretend that the todo list has just three features: "add", "delete", and "edit".Break the app by deleting the code for the "add" feature.Then, fix it so that the "add" feature works again.Repeat this process for the remaining features "delete" and "edit".',
    'fix every combination of 1 missing feature'
  );
  controller.insertTodo( model.$root,
    'remove jQuery',
    'digestion techniques'
  );
  controller.insertTodo( model.$root,
    'The objective with this exercise is really simple. Make the application work exactly the same but do so without any jQuery. To break this exercise into more manageable steps, start by removing jQuery from app.js method-by-method (create, destroy, etc). Once you’re done, remove the jQuery script tag from index.html (line 56).',
    'remove jQuery'
  );


  controller.toggleTodo(
    model.$root,
    'prototype nested todo list'
  );
  controller.toggleTodo( model.$root,
    'read documentation'
  );
}