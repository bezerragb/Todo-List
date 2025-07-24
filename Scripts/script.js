const btnAddTask = document.querySelector('#btn-add-task');
const inputTask = document.querySelector('#input-task');
const containerTask = document.querySelector('#list-container-tasks');
const containerTaskDone = document.querySelector('#list-container-tasks-done');
const removeAllTaksDone = document.querySelector('#delete-tasks-done');
const checkAllTasks = document.querySelector('#check-all-tasks');


window.addEventListener('DOMContentLoaded', loadTasksFromStorage);

function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(taskText, done = false) {
  const taskList = document.createElement('li');
  const taskTitle = document.createElement('p');
  const iconsDiv = document.createElement('div');
  const iconCheck = document.createElement('i');
  const iconRemove = document.createElement('i');

  taskTitle.classList.add('title-task');
  taskList.classList.add('list-tasks');
  iconsDiv.classList.add('icons-tasks');
  iconCheck.classList.add('material-icons');
  iconRemove.classList.add('material-icons');

  taskTitle.textContent = taskText;
  iconCheck.textContent = 'check';
  iconRemove.textContent = 'delete';

  if (done) {
    taskTitle.classList.add('title-task-done');
    taskList.appendChild(taskTitle);
    containerTaskDone.appendChild(taskList);
  } else {
    taskList.appendChild(taskTitle);
    iconsDiv.appendChild(iconCheck);
    iconsDiv.appendChild(iconRemove);
    taskList.appendChild(iconsDiv);
    containerTask.appendChild(taskList);
  }

  iconCheck.addEventListener('click', () => {
    taskTitle.classList.add('title-task-done');
    taskList.removeChild(iconsDiv);
    containerTask.removeChild(taskList);
    containerTaskDone.appendChild(taskList);
    updateTaskStatus(taskText, true);
  });

  iconRemove.addEventListener('click', () => {
    containerTask.removeChild(taskList);
    removeTask(taskText);
  });
}

function loadTasksFromStorage() {
  const tasks = getTasksFromStorage();

  tasks.forEach(task => {
    createTaskElement(task.text, task.done);
  });
}

btnAddTask.addEventListener('click', () => {
  const taskText = inputTask.value.trim();

  if (taskText === '') {
    window.alert("Você não pode adicionar uma tarefa vazia");
    return;
  }

  const tasks = getTasksFromStorage();
  const exists = tasks.some(t => t.text === taskText);
  if (exists) {
    alert("Essa tarefa já existe!");
    return;
  }

  tasks.push({ text: taskText, done: false });
  saveTasksToStorage(tasks);
  createTaskElement(taskText, false);
  inputTask.value = '';
});

checkAllTasks.addEventListener('click', () => {
  const tasks = getTasksFromStorage().map(task => {
    if (!task.done) {
      task.done = true;
    }
    return task;
  });

  saveTasksToStorage(tasks);
  containerTask.innerHTML = '';
  containerTaskDone.innerHTML = '';
  loadTasksFromStorage();
});

removeAllTaksDone.addEventListener('click', () => {
  let tasks = getTasksFromStorage();
  tasks = tasks.filter(task => !task.done);
  saveTasksToStorage(tasks);
  containerTaskDone.innerHTML = '';
});

function updateTaskStatus(taskText, done) {
  const tasks = getTasksFromStorage();
  const task = tasks.find(t => t.text === taskText);
  if (task) {
    task.done = done;
    saveTasksToStorage(tasks);
  }
}

function removeTask(taskText) {
  let tasks = getTasksFromStorage();
  tasks = tasks.filter(task => task.text !== taskText);
  saveTasksToStorage(tasks);
}
