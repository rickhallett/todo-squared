function constructSingleTodoDOM() {
  //create containing li that wraps around main todo and its subtasks
  let todoWrapper = document.createElement('li');
  todoWrapper.className = 'todos';

  //create todo div to create consistent todo styling
  let todoDIV = document.createElement('div');
  todoDIV.className = 'todo';

  //create seperate todo__task div so that parent flexbox property has more organised control
  let todo__taskDIV = document.createElement('div');
  todo__taskDIV.className = 'todo__task';

  //create checkbox and insert it into todo__task div
  let toggleCheckbox = document.createElement('input');
  toggleCheckbox.type = 'checkbox';
  toggleCheckbox.id = 'toggle';
  todo__taskDIV.appendChild(toggleCheckbox);

  //create todo text label and insert it into todo__task div
  let todoText = document.createElement('label');
  todoText.textContent = 'this todo was created by javascript!';
  todo__taskDIV.appendChild(todoText);

  //insert compound todo__task div into parent todo div
  todoDIV.appendChild(todo__taskDIV);

  //create destroy button and insert it into parent todo div
  let destroyButton = document.createElement('button');
  destroyButton.className = 'destroy';
  destroyButton.textContent = 'x';
  todoDIV.appendChild(destroyButton);

  //place compound todo div into the master todo container
  todoWrapper.appendChild(todoDIV);

  return todoWrapper;
}

