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




$todoListDemo = {
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
          subTodo: null
        }
      ]
    },
  ]
}

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

console.log($todoList);
