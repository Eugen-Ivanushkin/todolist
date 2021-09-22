const todoItem = new ToDoList();

/******** VIEW *********/
const rootDiv = document.querySelector('#root');

/******** TITLE *********/
const titleToDo = document.createElement('h1');
titleToDo.textContent = 'Todolist';

/******** MAIN SECTION *********/
const main = document.createElement('main');
main.setAttribute('id', 'main');

/******** ADD INPUT *********/
const addInput = document.createElement('input');
addInput.setAttribute('id', 'add_input');
addInput.setAttribute('type', 'text');
addInput.setAttribute('placeholder', 'What need to be done?');

/******** LIST  *********/
const todoListEl = document.createElement('ul');
todoListEl.setAttribute('id', 'todo_list');


/******** BUTTON GROUP *********/
const buttonsActionWrapper = document.createElement('div');
buttonsActionWrapper.setAttribute('id', 'button_group');
buttonsActionWrapper.classList.add('button_group');

/******** ALL *********/
const showAllBtn = document.createElement('button');
showAllBtn.classList.add('group-btn', 'show-all-btn');
showAllBtn.textContent = 'All';

/******** SHOW ACTIVE *********/
const showActiveBtn = document.createElement('button');
showActiveBtn.classList.add('group-btn', 'show-activ-btn');
showActiveBtn.textContent = 'Active';

/******** SHOW COMPILED *********/
const showComplitedBtn = document.createElement('button');
showComplitedBtn.classList.add('group-btn', 'show-complited-btn');
showComplitedBtn.textContent = 'Complited';

/******** CLEAR COMPILED ALL *********/
const clearComplitedBtn = document.createElement('button');
clearComplitedBtn.classList.add('group-btn', 'delete-complited');
clearComplitedBtn.textContent = 'Clear complited';

/******** APPEND GROUP *********/
buttonsActionWrapper.append(
  showAllBtn, 
  showActiveBtn, 
  showComplitedBtn, 
  clearComplitedBtn
  );

/******** APPEND MAIN *********/
main.append(
  addInput,
  todoListEl,
);
/******** APPEND ROOT *********/
rootDiv.append(
  titleToDo,
  main,
);

/******** EVENT LISTENERS *********/
addInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    todoItem.create(e.target.value);
    e.target.value = '';
    render(todoItem.getAll());
  };
});

addInput.addEventListener('blur', function (e) {
  todoItem.create(e.target.value);
  e.target.value = '';
  render(todoItem.getAll());
});

/******** TODO EVENT *********/
todoListEl.addEventListener('click', function(e){
  if(e.target.classList.contains('item-delete-button')){
    const id = +e.target.parentElement.id;
    todoItem.deleteTask(id);
    render(todoItem.getAll());
  };

  if(e.target.classList.contains('text')){
    const id = +e.target.parentElement.id;
    theClick(e, id);
  };

  if(e.target.classList.contains('list-item')){
    const id = +e.target.id;
    theClick(e, id);
  };
});

/******** BUTTON GROUP EVENT *********/
buttonsActionWrapper.addEventListener('click', function(e){
  if(e.target.classList.contains('button_group')){
    return;
  }

  toggleActiveBtn(e);

  if(e.target.classList.contains('show-all-btn')){
    e.target.classList.toggle('active-btn');
    render(todoItem.getAll());
  };

  if(e.target.classList.contains('show-activ-btn')){
    e.target.classList.toggle('active-btn');
    render(todoItem.getActive());
  };

  if(e.target.classList.contains('show-complited-btn')){
    e.target.classList.toggle('active-btn');
    render(todoItem.getComplited());
  };

  if(e.target.classList.contains('delete-complited')){
    e.target.parentElement.children[0].classList.toggle('active-btn');
    todoItem.clearComplited();
    render(todoItem.getAll());
  };
});

/******** HELPER DOUBLE CLICK *********/
let waitingForClick = false;

function theClick(e, id){

  switch (e.detail){
    case 1: //first click
      waitingForClick = setTimeout(function(){
        todoItem.isDone(id);
        render(todoItem.getAll());
      },250);
      break;
    
    default: // more click
      if(waitingForClick){ //remove click
        clearTimeout(waitingForClick);
        waitingForClick = false;
      };
      
      const inputChangeText = document.createElement('input');
      inputChangeText.classList.add('change_input');
      let textEl = null;

      if(e.target.classList.contains('text')){
        textEl = e.target;
      } 
      else if(e.target.classList.contains('list-item')){
        textEl = e.target.children[0];
      };

      inputChangeText.value = textEl.textContent;
      textEl.parentElement.prepend(inputChangeText);
      textEl.textContent = "";

      inputChangeText.focus();
      inputChangeText.onblur = function(){
        textEl.textContent = inputChangeText.value;
        inputChangeText.remove();
        todoItem.updateTask(id, textEl.textContent);
        render(todoItem.getAll());
      };
      break;
  };
};

/******** TOGGLE ACTIVE *********/
function toggleActiveBtn (e){
  const buttonCollection = e.currentTarget.children;
  for(button of buttonCollection){
    button.classList.remove('active-btn')
  };
};


/******** RENDER *********/
function render (store) {

  todoListEl.innerHTML = '';

  store.forEach(item => {

    /******** TODO ITEM *********/
    const itemEl = document.createElement('li');
    itemEl.setAttribute('id', item.id);
    itemEl.classList.add('list-item');

    /******** DELETE BUTTON *********/
    const itemDeleteBtn = document.createElement('button');
    itemDeleteBtn.textContent = 'x';
    itemDeleteBtn.classList.add('item-delete-button');

    /******** ITEM TEXT *********/
    const itemText = document.createElement('p');
    itemText.textContent = item.text;
    itemText.classList.add('text');
    item.status?
    itemText.classList.add('isDone')
    :
    itemText.classList.remove('isDone');

    /******** APPEND ITEM AND LIST *********/
    itemEl.append(
      itemText,
      itemDeleteBtn
    );
    todoListEl.appendChild(itemEl);
  });

  todoItem.getAll().length === 0? buttonsActionWrapper.remove() : main.append(buttonsActionWrapper);
};