import DOMPurify from "dompurify";
let __esModule;
const todoList = [];
const inputField = document.querySelector('#newTaskInput');
const addButton = document.querySelector('#addButton');
const listShown = document.querySelector('#todoList');
let itemindex = 0;
// Lägger till lyssnare om knappen finns
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
function addToDo() {
    let itemToAddInput = inputField.value;
    let itemToAddClean = DOMPurify.sanitize(itemToAddInput); // Rensar inmatningen så att det inte finns skadlig kod eller dyl.
    todoList.push('<li id="item' + itemindex + '">' + itemToAddClean + '</li>');
    printList(todoList);
    inputField.value = "";
    let tempItem = document.querySelector('#item{itemIndex}');
    console.log(tempItem);
    itemindex += 1;
}
;
function printList(listToShow) {
    if (listToShow.length == 0) {
        if (listShown) {
            listShown.innerHTML = "<li>Din ToDo-lista är tom just nu!</li>";
            listShown.style.listStyleType = "none";
        }
    }
    else {
        let tempList = listToShow.toString();
        let printList = tempList.replaceAll(",", " ");
        listShown.innerHTML = printList;
    }
}
printList(todoList);
//# sourceMappingURL=myscript.js.map