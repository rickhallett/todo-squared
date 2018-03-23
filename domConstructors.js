function constructContainer() {
  //create container div for app
  let todoContainer = document.createElement('div');
  todoContainer.className = 'todoContainer';

  //create div to contain header elements
  let header = document.createElement('div');
  header.id = 'header';

  let toggleAllIcon = document.createElement('i');
  toggleAllIcon.className = 'fas fa-angle-down fa-2x toggle-all';
  header.appendChild(toggleAllIcon);

  let input = document.createElement('input');
  input.id = 'enter';
  input.placeholder = 'What would you like todo?';
  header.appendChild(input);

  let addTodoButton = document.createElement('button');
  addTodoButton.id = 'add-todo';
  addTodoButton.textContent = 'Add Todo';
  header.appendChild(addTodoButton);

  todoContainer.appendChild(header);
  return todoContainer;
}

function constructTodoComponent(text) {
  //create todo div to create consistent todo styling
  let todoLI = document.createElement('li');
  todoLI.className = 'todo';

  let todoText = document.createElement('div');
  todoText.className = 'todo-text';

  //create checkbox and insert it into todo-text div
  let toggleCheckbox = document.createElement('input');
  toggleCheckbox.type = 'checkbox';
  toggleCheckbox.id = 'toggle';
  todoText.appendChild(toggleCheckbox);

  //create todo text label and insert it into todo-text div
  let todo = document.createElement('label');
  //HACK: unknown cause of label text closer to checkbox when created through this function
  todo.textContent = ' ' + text;
  todoText.appendChild(todo);

  //insert compound todo-text div into parent todo div
  todoLI.appendChild(todoText);

  //create destroy button and insert it into parent todo div
  let destroyButton = document.createElement('button');
  destroyButton.className = 'destroy';
  destroyButton.textContent = 'x';
  todoLI.appendChild(destroyButton);

  return todoLI;
}

function constructTodoList() {
  let todoList = document.createElement('ul');
  todoList.className = 'todo-list';
  return todoList;
}

function constructSubTodoList() {
  let subTodoList = document.createElement('ul');
  subTodoList.className = 'sub-todo-list';
  return subTodoList;
}


