

const inputField = document.getElementById('input');
const addButton = document.getElementById('add');
const toDoContainer = document.querySelector('.todos');
const countSpan = document.getElementById('count');
const clearButton = document.getElementById('clear');
let items = null;

class ToDoStorage {
    STORAGE_NAME = 'todos';
    items;
    get elements() {
        return this.items;
    }
    constructor() {
        this.items = JSON.parse(localStorage.getItem(this.STORAGE_NAME));
        if(!this.items) {
            this.items = [];
        }
    }

    addNew(item) {
        this.items.push(item);
        localStorage.setItem(this.STORAGE_NAME, JSON.stringify(this.items));
    }
    setComplite(id) {
        this.items.find(item => item.id === id).isComplited = true;
        localStorage.setItem(this.STORAGE_NAME, JSON.stringify(this.items));
    }
    removeItems(ids) {
        ids.forEach(id => {
            this.items = this.items.filter(item => item.id !== id);
        });
        localStorage.setItem(this.STORAGE_NAME, JSON.stringify(this.items));
    }
}

function createToDo(id, text, isComplited = false) {
    return `
    <div class="todo ${isComplited? 'complited' : ''}" id=${id}>
        <p class="todo-text">${text}</p>
        <button class="todo-remove">
            <i class="bi bi-trash"></i>
        </button>
    </div>
    `;
}
let storage = null;
window.addEventListener('DOMContentLoaded', e => {
    storage = new ToDoStorage();
    console.log(storage);
    storage.elements.forEach(item => {
        toDoContainer.insertAdjacentHTML('beforeend', createToDo(item.id, item.value, item.isComplited));
    });
    countSpan.innerText = storage.elements.length;
});

addButton.addEventListener('click', e => {
    if(inputField.value === '') return;
    const item = {
        id: 'item_' + Date.now(),
        value: inputField.value,
        isComplited: false
    };
    const template = createToDo(item.id, item.value);
    storage.addNew(item);
    inputField.value = '';
    toDoContainer.insertAdjacentHTML('beforeend', template);
    countSpan.innerText = storage.elements.length;
});

toDoContainer.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        storage.removeItems([e.target.parentElement.id]);
        e.target.parentElement.remove();
        countSpan.innerText = storage.elements.length;
    }

    if (e.target.tagName === 'DIV') {
        e.target.classList.toggle('complited');
        storage.setComplite(e.target.id);
    }
});

clearButton.addEventListener('click', e => {
    const complited = toDoContainer.querySelectorAll('.complited');
    storage.removeItems([...complited].map(el => el.id));
    complited.forEach(el => el.remove());
    countSpan.innerText = storage.elements.length;
});