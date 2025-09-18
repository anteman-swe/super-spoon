// Mitt javascript för en todo-lista
let todoList = [];
const inputField = document.querySelector('#newTaskInput');
const addButton = document.querySelector('#addButton');
const listShown = document.querySelector('#todoList');
const readyItems = document.querySelector('#readyItems');
let itemindex = 0;
let readyItemCounter = 0;
// Lägger till lyssnare om knappen och inputfält finns
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

function changeTask(klick){
    const whichItem = klick.target;
    const itemIndex = Number(whichItem.getAttribute('id').at(-1));
    const itemStatus = window.getComputedStyle(whichItem).getPropertyValue('color');
    if (itemStatus == 'rgb(0, 0, 0)' && !(whichItem.classList.contains('itemDone'))) {
        whichItem.classList.add('itemDone');
        todoList.at(itemIndex).done = true;
        whichItem.style.listStyleType = 'disc';
        readyItemCounter++;
    } else {
        whichItem.classList.remove('itemDone');
        whichItem.style.listStyleType = 'circle';
        readyItemCounter--;
    }
    updateReady(readyItemCounter);
}
    
 function removeTask(dblKlick){
    const whichItem = dblKlick.target;
    const itemStatus = window.getComputedStyle(whichItem).getPropertyValue('color');
    
    if (itemStatus == 'rgb(0, 128, 0)'){
        if (readyItemCounter > 0) {
            readyItemCounter--;
        }
    }
    const itemID = Number(whichItem.getAttribute('id').at(-1));
        if (todoItems.length > 0) {
            todoItems.splice(itemID, 1);
        }
    updateReady(readyItemCounter);
    console.log(todoList);
 }

function updateReady(readyCount) {
    readyItems.textContent = `${readyCount} uppgifter färdiga`;
    console.log(todoList);

}

function updateAndControlItemList() {
    let listToCheck = document.getElementsByTagName('li');
    console.log(listToCheck);
}

function cleanInput(textToClean) {
    cleanText = textToClean;
    return cleanText;
}

function addToDo() {
    let itemToAddInput = inputField.value;
    if (!(itemToAddInput == '' || itemToAddInput == null)) {
        const  itemToAddClean = cleanInput(itemToAddInput) // Här har jag tänkt att göra kontroll istället med regular expression
        const itemAdd = document.createElement('li');
        const itemText = document.createElement('span');
        const trashCan = document.createElement('span');
        trashCan.textContent = 'delete';
        trashCan.setAttribute('class', 'material-symbols-outlined');
        trashCan.addEventListener('click', removeTask);
        itemText.textContent = ' ' + itemToAddClean + ' ';
        itemText.setAttribute('id', `item${itemindex}`);
        itemText.addEventListener('click', changeTask);
        itemText.addEventListener('dblclick', removeTask);
        itemAdd.appendChild(itemText);
        itemAdd.appendChild(trashCan);
        listShown.appendChild(itemAdd);
        todoList.push({todo: itemToAddInput, done: false});
        inputField.value = "";
        itemindex++;
    } 
}
updateReady(readyItemCounter);
updateAndControlItemList();