console.log('concept.js loaded');

//have root list (base parent)
//have a way of adding todos to this list.
//each todo can itself be a parent
//do we need a todo id?
  //no, as we can create a DOM identifier from the lists array position and list name (so its unique)

//needs way of dynamically creating sublist names based on parent

// =================================
//      mixed data types
// =================================
/*
var todoList = {
  name: '$root',
  rootTodos: []
}

function createTodo(name, parent) {
  var list = {};
  list.name = name;
  list.parent = parent || null;
  list.subTodos = [];
  return list;
}

todoList.rootTodos.push(createTodo('todo 1'));
todoList.rootTodos.push(createTodo('todo 2'));
todoList.rootTodos.push(createTodo('todo 3'));

todoList.rootTodos[0].subTodos.push(createTodo('todo 1-1'));
todoList.rootTodos[0].subTodos[0].subTodos.push(createTodo('todo 2-1'));
todoList.rootTodos[0].subTodos[0].subTodos[0].subTodos.push(createTodo('todo 3-1'));

console.log(todoList);


// =================================
//    nested objects
// =================================
//What is the problem? How can we start at the root list, and have a function traverse 'down' its children if it doesn't keep a log of its children? As it stands, traversing upwards is fine as parents are stored
//How can we add a 'child' property that has a consistently repeating structure?

function List(name, parent) {
  this.parent = parent || null;
  this.name = name;
}

var list = new List('root-list');
var childList = new List('child-list', list);
var siblingList = new List('sibling-list', list);
var secondGenChildList = new List('second-gen', childList);

console.log(list)
console.log(childList)
console.log(siblingList)
console.log(secondGenChildList)
*/

// =================================
//     function constructors
// =================================

//make a function that creates an object
function Todo(name, parent) {
  this.name = name;
  this.parent = parent || null;
  this.siblings = [];
}

//have a method on that object that adds a child property which itself is a copy of the original object
Todo.prototype.createChild = function(name, parent) {
  this.child = new Todo(name, parent);
}

Todo.prototype.createSibling = function(name) {
  var todo = new Todo(name, this);
  this.siblings.push(todo);
};

var rootTodo = new Todo('Top layer')

rootTodo.createChild('2nd layer', rootTodo)
rootTodo.child.createChild('3rd layer', rootTodo.child)
rootTodo.child.child.createChild('4th layer', rootTodo.child.child);
//this will allow traversal whilst child !== null


rootTodo.createSibling('sibling todo on top layer');
rootTodo.child.createSibling('sibling todo on 2nd layer');
rootTodo.child.child.createSibling('sibling todo on 3rd layer');

console.log(rootTodo);
