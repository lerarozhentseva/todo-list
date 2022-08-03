function generateUniqID() {
  return Math.random().toString(36).substr(2, 9);
}

const LS_KEY = 'TODOS';

(() => {
  if(!Array.isArray(JSON.parse(localStorage.getItem(LS_KEY)))) {
    localStorage.setItem(LS_KEY, JSON.stringify([]))
  }
})() 

const addTodoInput = document.querySelector('.add-todo-input');
const addTodoButton = document.querySelector('.add-todo-button');
const todoList = document.querySelector('.list');
const tabsBtns = document.querySelectorAll(".tabs .button")
const [allTab, activeTab, doneTab] = tabsBtns;
const searchInput = document.querySelector(".search-input input")

function getItemsFromStorage() {
  const items = JSON.parse(localStorage.getItem(LS_KEY));
  return items
}

function getItemsFromHTML() {
  const items = document.querySelectorAll(".list .todo");
  return items
}

const items = getItemsFromStorage()

items.forEach(e => {
  todoList.insertAdjacentHTML('afterbegin', getTodoHTML(e));
})


function addNewTodoToStorage(todo) {
  const oldValue = JSON.parse(localStorage.getItem(LS_KEY));
  localStorage.setItem(LS_KEY, JSON.stringify([...oldValue, todo]))
}

function getTodoHTML({ id, name, done }) {
  return `
  <div class="todo ${done ? "todo--active" : "" }" data-id="${id}">
    <label class="checkbox">
      <input class="input" ${done ? "checked" : "" } data-id="${id}"type="checkbox" />
      <div class="checkbox-icon"></div>
    </label>
    <span class="text">${name}</span>
    <button class="negative ui button">Удалить</button>
    <button class="circular ui icon button button-edit">
      <i class="icon cog"></i>
    </button>
  </div>
  `
}

addTodoButton.addEventListener('click', () => {
  const todoName = addTodoInput.value;

  const todoItem = {
    id: generateUniqID(),
    name: todoName,
    done: false,
  }

  addNewTodoToStorage(todoItem)
  todoList.insertAdjacentHTML('afterbegin', getTodoHTML(todoItem))
  addTodoInput.value = ""
})

function doneFunc(e) {
  if(e.target.matches(".input")){
    const elementId = e.target.closest("div[data-id]").dataset.id
    const items1 = getItemsFromStorage()
    items1.forEach(e => {
      if(e.id === elementId){
        e.done = !e.done;
      } ;
    })
    localStorage.setItem(LS_KEY, JSON.stringify([...items1]))
    const htmlElement = document.querySelector(`[data-id = "${elementId}"]`)
    htmlElement.classList.toggle("todo--active")
  }
  if(e.target.matches(".negative")){
    let confirmDel = confirm("Вы действительно хотите удалить эту задачу?");
    if(confirmDel) {
      const delId = e.target.closest("div[data-id]").dataset.id
      const htmldel = document.querySelector(`[data-id = "${delId}"]`)
      const items2 = getItemsFromStorage().filter(function(e) { return e.id !== delId })
      localStorage.setItem(LS_KEY, JSON.stringify([...items2]))
      htmldel.remove()
    }
  }
  if(e.target.matches(".circular")){
    const circId = e.target.closest("div[data-id]").dataset.id
    const panel = newPanelHtml(circId)
    panel.addEventListener("click", editFunc)
  }
}

todoList.addEventListener("click", doneFunc)

function newPanelHtml(id){
  const oldElem = document.querySelector(`[data-id = "${id}"]`)
  while (oldElem.firstChild) {
    oldElem.removeChild(oldElem.firstChild);
  }
  oldElem.insertAdjacentHTML('afterbegin', getCircTodoHTML(oldElem))
  return oldElem
}

function getCircTodoHTML(htmlElem) {
  const items9 = getItemsFromStorage() 
  let name 
  items9.forEach((e) => {
    if(e.id === htmlElem.dataset.id){
      name = e.name
    } 
  })
  return `
      <div class="ui small input input-edit">
      <input type="text" value="${name}" placeholder="Введите новое название...">
      </div>
      <button class="ui positive button small save">Сохранить</button>
      <button class="ui button small abolition">Отмена</button>
`
}      


function editFunc(e){
  const currentElem = e.target.closest("div[data-id]")
  const editId = currentElem.dataset.id
  if(e.target.matches(".save")){
    const items4 = getItemsFromStorage()
    items4.forEach(elem => {
      if(elem.id === editId){ 
        const newName = currentElem.querySelector("input").value
        elem.name = newName
        localStorage.setItem(LS_KEY, JSON.stringify([...items4])) 
        currentElem.remove()
        todoList.insertAdjacentHTML('afterbegin', getTodoHTML(elem))
      }; 
    } )
  }
  if(e.target.matches(".abolition")){
    const items5 = getItemsFromStorage()
    items5.forEach(elem => {
      if(elem.id === editId){ 
        currentElem.remove()
        todoList.insertAdjacentHTML('afterbegin', getTodoHTML(elem))
      }; 
    })
  }
}

allTab.addEventListener("click", (e) => {
  allTab.classList.add("blue")
  activeTab.classList.remove("blue")
  doneTab.classList.remove("blue")
  const items6 = getItemsFromHTML()
  for(let item of items6){
    item.classList.remove("hidden")
  }
})
activeTab.addEventListener("click", (e) => {
  allTab.classList.remove("blue")
  activeTab.classList.add("blue")
  doneTab.classList.remove("blue")
  const items7 = getItemsFromHTML()
  for(let item of items7){
    if(item.classList.contains("todo--active")){
      item.classList.add("hidden")
    }else{
      item.classList.remove("hidden")
    }
  }
})
doneTab.addEventListener("click", (e) => {
  allTab.classList.remove("blue")
  activeTab.classList.remove("blue")
  doneTab.classList.add("blue")
  const items8 = getItemsFromHTML()
  for(let item of items8){
    if(item.classList.contains("todo--active")){
      item.classList.remove("hidden")
    }else{
      item.classList.add("hidden")
    }
  }
})

searchInput.addEventListener("input", () => {
  let searchValue = searchInput.value
  const items = getItemsFromHTML()
  for(let item of items){
    if(!item.querySelector("span").textContent.toUpperCase().startsWith(searchValue.toUpperCase())){
      item.classList.add("hidden")
    }else item.classList.remove("hidden")
  }
})