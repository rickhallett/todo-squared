console.log('concept.js loaded');

/*
Todo List:
1. create recursive functions that 'walk' rootTodo, printing out each layer
*/


//create a function that takes the parent text and child text
//create the function on the data object, so that it can traverse with 'this'
//if no parent text, make parent text 'root'

//the data structure is a series of nested objects
//each object needs a unique identifier, todo text, completed property, and a reference to both its parent and any child todos

// =================================
//          prototype
// =================================

$todoListDemoData = {
  $root: [
    {
      parent: '$root',
      text: 'Complete watchandcode',
      completed: false,
      dateCreated: '19/04/2018',
      subTodo: null
    },
    {
      parent: '$root',
      text: 'master js',
      completed: false,
      dateCreated: '19/04/2018',
      subTodo: [
        {
          parent: 'master js',
          text: 'master vue.js',
          completed: false,
          dateCreated: '19/04/2018',
          subTodo: [
          {
            parent: 'master vue.js',
            text: 'complete tutorial',
            completed: false,
            dateCreated: '19/04/2018',
            subTodo: null
          },
          {
            parent: 'master vue.js',
            text: 'read documentation for each feature (don\'t rush)',
            completed: false,
            dateCreated: '19/04/2018',
            subTodo: null
          }
        ]
        }
      ]
    },
  ]
}

function TodoList() {
  this.$root = [];
}

//function constructor to create todos
function Todo(text, parent) {
  this.parent = parent || '$root';
  this.text = text;
  this.completed = false;
  this.dateCreated = new Date();
  this.subTodo = null;
}

//function to find todos by name
//EXTRA FEATURE: store all todos with matching text, create array and return all these todos with link to parent
TodoList.prototype.findTodo = function (text) {
  let foundTodo;

  function find(inArray) {
    inArray.forEach(function(currentTodo, index) {
      //recursive case
      if(currentTodo.subTodo !== null) {
        return find(currentTodo.subTodo);
      }
      //base case
      if(currentTodo.text === text) {
        foundTodo = currentTodo;
        return;
      }
    });

    return foundTodo;
  }
  return find($todoListDemoData.$root);
}

//function to add todos at named level
TodoList.prototype.insertTodo = function (text, parent) {
  if (parent) {
    // debugger;
    function find(inArray) {
      inArray.forEach(function (currentTodo, index) {
        //base case
        if (currentTodo.text === parent) {
          //initialise array and insert todo
          currentTodo.subTodo = [];
          currentTodo.subTodo.push(new Todo(text, parent));
          //does return stop for each
          return;
        }
        //recursive case
        if (currentTodo.subTodo !== null) {
          return find(currentTodo.subTodo);
        }
      });
    }

    find($todoList.$root)

  } else {
    $todoList.$root.push(new Todo(text, parent));
  }
}

let $todoList = new TodoList();

$todoList.insertTodo('Complete watchandcode');
$todoList.insertTodo('master javascript');
$todoList.insertTodo('master js');
$todoList.insertTodo('consider reviewing some videos', 'Complete watchandcode');
$todoList.insertTodo('get a javascript developer job', 'master javascript');
$todoList.insertTodo('complete BYOA', 'master js');
$todoList.insertTodo('build a robust web app', 'get a javascript developer job');

console.log($todoList)



/*
$todoList = {
  $root: [
    {
      parent: '$root',
      text: 'Complete watchandcode',
      completed: false,
      dateCreated: '19/04/2018',
      subTodo: null
    },
    {
      parent: '$root',
      text: 'become a javascript ninja',
      completed: false,
      dateCreated: '19/04/2018',
      subTodo: [
        {
          parent: 'become a javascript ninja',
          text: 'complete BYOA',
          completed: false,
          dateCreated: '19/04/2018',
          subTodo: [
            {
              parent: 'complete BYOA',
              text: 'complete scope inheritance',
              completed: false,
              dateCreated: '19/04/2018',
              subTodo: null
            },
            {
              parent: 'complete BYOA',
              text: 'move onto data parsing',
              completed: false,
              dateCreated: '19/04/2018',
              subTodo: null
            }
          ]
        },
        {
          parent: 'become a javascript ninja',
          text: 'master vue.js',
          completed: false,
          dateCreated: '19/04/2018',
          subTodo: [
            {
              parent: 'master vue.js',
              text: 'complete tutorial and documentation',
              completed: false,
              dateCreated: '19/04/2018',
              subTodo: null
            },
            {
              parent: 'master vue.js',
              text: 'created nested todo app with vue',
              completed: false,
              dateCreated: '19/04/2018',
              subTodo: null
            }
          ]
        },
        {
          text: 'beat Jonathan at javascript',
          completed: false,
          dateCreated: '19/04/2018',
          subTodo: [
            {
              parent: 'beat Jonathan at javascript',
              text: 'kick',
              completed: false,
              dateCreated: '19/04/2018',
              subTodo: null
            },
            {
              parent: 'beat Jonathan at javascript',
              text: 'his',
              completed: false,
              dateCreated: '19/04/2018',
              subTodo: null
            },
            {
              parent: 'beat Jonathan at javascript',
              text: 'ass',
              completed: false,
              dateCreated: '19/04/2018',
              subTodo: null
            }
          ]
        }
      ]
    },
    {
      parent: '$root', text: 'take out dog',
      completed: false,
      dateCreated: '19/04/2018',
      subTodo: [
        {
          text: 'pick up her poo',
          completed: false,
          dateCreated: '19/04/2018',
          subTodo: null
        }
      ]
    },
    {
      parent: '$root', text: 'find another hobby',
      completed: false,
      dateCreated: '19/04/2018',
      subTodo: null
    }
  ]
};
*/
