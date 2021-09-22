/******** TEXT VALIDATION ********/
function textValidation (text){
  if(typeof text !== 'string'){
    throw new Error('The name of task must be string type');
  };
  if(text.trim() === ''){
    throw new Error('Fill in the input field');
  }
};

/******** ID VALIDATION ********/
function idValidation (id){
  if(typeof id !== 'number'){
    throw new Error('Should be id type number');
  }
}

/******** TODO ITEM MODEL ********/
class ListItemModel {
  constructor(text){
    textValidation(text);

    this.text = text;
    this.status = false;
    this.id = Date.now() + Math.floor(Math.random()*10000);
  };
};

/******** TODOLIST ********/
class ToDoList {
  constructor(){
    this.store = [];
  };

  /******** CREATE ********/
  create(text){
    try {
      const task = new ListItemModel(text);
      this.store.push(task);
      return task;
    } catch (error) {
      console.log(error);
    };
  };

  /******** DELETE ********/
  deleteTask (id){
    idValidation(id);
    const index = this.findIdx(id);
    const deleteEl = this.store.splice(index, 1);
  
    return deleteEl;
  };

  /******** ISDONE ********/
  isDone(id){
    idValidation(id);
    const index = this.findIdx(id);
    const  updateStatus = this.store.splice(index, 1)[0];
  
    updateStatus.status = !updateStatus.status
    
    this.store.splice(index, 0, updateStatus);
  
    return updateStatus.status;
  };

  /******** UPDATE ********/
  updateTask (id, text){
    idValidation(id);
    const index = this.findIdx(id);
    const  modifyTask = this.store.splice(index, 1)[0];
    modifyTask.text = text;
    this.store.splice(index, 0, modifyTask);
  
    return modifyTask;
  };

  /******** GET ALL ********/
  getAll(){
    return this.store;
  };

    /******** GET ACTIVE ********/
    getActive(){
      return this.store.filter(item => item.status === false);
    };

    /******** GET COMPLITED ********/
    getComplited(){
      return this.store.filter(item => item.status === true);
    };

    /******** CLEAR COMPLITED ********/
    clearComplited(){
      return this.store = this.store.filter(item => item.status === false);
    };

  /******** FIND INDEX ********/
  findIdx(id){
    return this.store.findIndex(item => item.id === id);
  };
};
