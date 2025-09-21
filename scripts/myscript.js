// My javascript used for a todo-list

// Declaring global variabels and constants
let todoList = [];
const inputField = document.querySelector('#newTaskInput');
const addButton = document.querySelector('#addButton');
const listShown = document.querySelector('#todoList');
const readyItems = document.querySelector('#readyItems');
const taskAlreadyExist = document.querySelector('#task-already-exist');

let readyItemCounter = 0;
// Adding listeners if addButton and inputField exists, if not log out an error message in console
if (addButton && inputField) {
    addButton.addEventListener('click', addToDo);
    inputField.addEventListener('keydown', (event) => {
        if (event.key == 'Enter') {
            addToDo();
        }
        return;
    });
}
else {
    console.log('Variabler kopplade till DOM har returnerat null');
}

// Function to save task to local storage
const saveToLocal = (itemToSave, index = (todoList.length - 1)) => {
    localStorage.setItem(`task${index}`, JSON.stringify(itemToSave));
}

// Function to update tasks in local storage
const updateLocalDone = (item, state) => {
    let itemTochange = JSON.parse(localStorage.getItem(`task${item}`));
    let itemToLoadBack = {todo: itemTochange.todo, done: state};
    localStorage.setItem(`task${item}`, JSON.stringify(itemToLoadBack));
}   

// Function to get tasks from local storage
const getFromLocal = () => { 
    let indexCounter = 0;
    let  savedTaskArray = [];
    while (localStorage.getItem(`task${indexCounter}`)) {
        let retrievedObject = JSON.parse(localStorage.getItem(`task${indexCounter}`));
        let newObject = {todo: retrievedObject.todo, done: retrievedObject.done};
        savedTaskArray[indexCounter] = newObject;
        indexCounter++;
    }
    return savedTaskArray;
}

const addRowToHTML = (taskItem) =>{
    // Her we create all neccesary DOM nodes for our task
            const itemAdd = document.createElement('li');
            const itemText = document.createElement('span');
            const trashCan = document.createElement('span');
            
            // First we create the trashcan and connect a listener to it
            trashCan.textContent = 'delete';
            trashCan.setAttribute('class', 'material-symbols-outlined');
            trashCan.addEventListener('click', removeTask);
            
            // Second we create our task with its text content
            itemText.textContent = taskItem.todo;
            if(taskItem.done){
                itemText.classList.add('itemDone');
            }
            itemText.addEventListener('click', changeTask);
            itemText.addEventListener('dblclick', removeTask);
            
            // Third we put together our complet item to show our task
            itemAdd.appendChild(itemText);
            itemAdd.appendChild(trashCan);
            listShown.appendChild(itemAdd);
}

const taskFinder = (findText) => {
    // find the task in the array and return index, if none found return '-1'
    let arrayIndex = -1;
    let arrayCounter = 0;
    todoList.forEach(item => {
        if (item.todo.toUpperCase() == findText.toUpperCase()){ // Using toUpperCase() so we not get fooled by different case of letters
            arrayIndex = arrayCounter;
            if (item.done == true && readyItemCounter > 0){
                readyItemCounter--;
            }
        }
        arrayCounter++;
    });
    return arrayIndex;
}

// Update the visible readycounter in page
const updateReady = (readyCount) => {    
    if (readyCount > 0) {
        readyItems.textContent = `${readyCount} uppgifter färdiga`;
        readyItems.style.backgroundColor = 'rgb(0, 128, 0, 0.5)';
    }
    else if (readyCount == 0 && todoList.length == 0) {
        readyItems.textContent = `Det finns inga uppgifter att göra`;
        readyItems.style.backgroundColor = 'rgb(255, 128, 128, 0.5)';
    }
    else {
        readyItems.textContent = `${readyCount} uppgifter färdiga`;
        readyItems.style.backgroundColor = 'rgb(0, 255, 0, 0.1)';
    }
}

const changeTask = (klick) => {
    const whichItem = klick.target;
    // Check if task exist in tasklist array
    const itemToChange = taskFinder(whichItem.textContent);

    // If task exist we can change it
    if (!(itemToChange == -1)) {
        
        // If task is already done, change it back to undone, otherwise mark it as done and last update readycounter
        if (whichItem.classList.contains('itemDone') && todoList[itemToChange].done) {
            whichItem.classList.remove('itemDone');
            todoList[itemToChange].done = false;
            if (readyItemCounter > 0) {
                readyItemCounter--;
                console.log('item to not done');
            }
            // We also update the task in localStorage
            updateLocalDone(itemToChange, false);
        } else {
            whichItem.classList.add('itemDone');
            todoList[itemToChange].done = true;
            readyItemCounter++;
            console.log('Item to done');

            // We also update the task in localStorage
            updateLocalDone(itemToChange, true);
        }
        
        // Update visible readycounter
        updateReady(readyItemCounter);
    }
    
}

//Function to remove items from list, both visble and saved array
const removeTask = (Klick) => {
    const whichItem = Klick.target;
    const textToSearch = whichItem.parentNode.firstChild.textContent;
    const itemToRemove = taskFinder(textToSearch);

    // If task does not exist, 'itemToRemove = -1' do nothing
    if (!(itemToRemove == -1)) {
        
        // Remove task from array and page
        todoList.splice(itemToRemove, 1);
        localStorage.removeItem(`task${itemToRemove}`);
        whichItem.parentNode.remove();
    }
    // Update visible counter on exit from function
    updateReady(readyItemCounter);
}

// Using DOMPurify to clean the input from any bad content
const cleanInput = (textToClean) => {
    const cleanText = DOMPurify.sanitize(textToClean);
    return cleanText;
}

// Function to add tasks to the todolist
function addToDo() {
    let itemToAddInput = inputField.value;
    // If input is empty or doesn't exist we do nothing
    if (!(itemToAddInput == '' || itemToAddInput == null)) {
        // Sending input to be cleaned by DOMPurify
        const  itemToAddClean = cleanInput(itemToAddInput);

        // #################################################### Under this line, we do not use dirty input itemToAddInput
        
        // We check if task already exist, if not we can add it
        const checkTaskExist = taskFinder(itemToAddClean);

        // We create the JSON Object to save and show
        let taskToAdd = {todo: itemToAddClean, done: false}
        
        // If task didn't exist we will add it / (-1) = task didn't exist
        if (checkTaskExist == -1){
            // Clean comment-field
            taskAlreadyExist.textContent = "";
            
            // Send the task to be added to list in DOM
            addRowToHTML(taskToAdd);

            // Here we push our task to the array
            todoList.push(taskToAdd);

            // Save the Item to local storage
            saveToLocal(taskToAdd);
            
            // Last we clean the the input field
            inputField.value = "";
        } else {
            // If task already existed, we let the user know
            taskAlreadyExist.textContent = "Den uppgiften finns redan, försök med ett annat namn."
        }
    }
    updateReady(readyItemCounter);
}
// Function to run first of all after page is loaded so todo-list gets loaded
function firstRun() {
    todoList = getFromLocal();
    if (todoList){
        todoList.forEach(item => {
            addRowToHTML(item);
            if (item.done) {
                readyItemCounter++;
            }   
        });
    } else {
        todoList = [];
    }
}

// Check if there is any saved tasks from before
firstRun();

// Update visible readycounter after first run has checked the todo-list
updateReady(readyItemCounter);
