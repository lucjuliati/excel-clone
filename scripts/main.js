const spreadsheet = document.querySelector(".spreadsheet");
const tableHeader = spreadsheet.querySelector("thead tr");
const tableBody = spreadsheet.querySelector("tbody");
const locationIndicator = document.querySelector("#location");

function generateSpreadsheet() {
    const numRows = 50;
    const numCols = 27;

    const headerItems = [
        '', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];

    for (let i = 0; i < numCols; i++) {
        let th = document.createElement("th");
        th.innerHTML = headerItems[i] ?? "";
        tableHeader.appendChild(th);
    }

    for (let i = 1; i <= numRows; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < numCols; j++) {
            const letter = headerItems[j] ?? "";
            const cell = document.createElement('td');

            if (j === 0) {
                cell.setAttribute("class", "row-counter");
                cell.innerHTML = i;
            } else {
                cell.setAttribute("contenteditable", "");
                cell.setAttribute("data-location", `${letter}${i}`);
                cell.setAttribute("data-color", "#ffffff");
                cell.setAttribute("data-type", "text");
                cell.onclick = (e) => handleCellClick(e);
            }

            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }
}

function handleCellClick(e) {
    if (e.target.dataset?.location) {
        locationIndicator.innerHTML = e.target.dataset?.location;
    }
}

let buttons = document.querySelectorAll('nav button');
let menuVar = document.getElementById('menuShow');
let navVar = document.getElementById('nav');
let modalBGVar = document.getElementById('modalBG')
let modalMainVar = document.getElementById('modalMain')
let modalTitlVar = document.getElementById('modalTitl')
let modalTxtVar = document.getElementById('modalTxt')
let mdlBtnOKVar = document.getElementById('mdlBtnOK')
let mdlBtnNOVar = document.getElementById('mdlBtnNO')
let navover;
document.addEventListener('DOMContentLoaded', function() {

});

menus = {
    fileMenu: [
        { name: "New", disable: false, action: function() { 
            sendModal("New document?", "Any progress made will be discarded", "Discard anyway", function() {location.reload()}, "Cancel")
        } },
        { name: "Open", disable: true, action: function() { alert() } },
        { name: "Save", disable: true, action: function() { alert() } }
    ],
    editMenu: [
        { name: "Un-do", disable: true, action: function() { alert() } },
        { name: "Re-do", disable: false, action: function() { alert() } },
    ],
    helpMenu: [
        { name: "About", disable: false, action: function() { 
            sendModal("Excells", "Version: ALPHA 0.1.0 (1320)\nMinimal excel clone with import and export functions!\nMade by Bre and Sif", null, null, "Nice :)")
         } }
    ]
};

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return rect.left + window.scrollX;
}

Array.from(buttons).forEach(e => e.addEventListener('click', () => {
    menuVar.style.display = 'block';
    menuVar.style.left = getOffset(e) + "px";

    let current = e.textContent.toLocaleLowerCase() + "Menu";
    let values = menus[current];

    menuVar.innerHTML = "";

    let size = 0;

    for (let i = 0; i < values.length; i++) {
        var div = document.createElement('div');
        div.innerText = values[i].name;

        if (values[i].disable) {
            div.style.color = '#898989'
        } else {
            div.addEventListener('click', function() {menuVar.style.display = 'none'} );
            div.addEventListener('click',values[i].action);
            div.style.color = '#000'
        }

        div.style.fontFamily = 'Arial, Helvetica, sans-serif';
        div.style.userSelect = 'none';
        div.style.padding = '5px';

        size += 28;

        div.addEventListener('mouseover', function () { navover = 1; });
        div.addEventListener('mouseout', function () { navover = 0; });

        menuVar.appendChild(div);

    }

    menuVar.style.height = size + "px";

}));

function closeModal() {
    modalBGVar.style.display = "none";
}

function sendModal(Title, Info, OKtext, OKaction, NOtext) {
    
    modalBGVar.style.display = "flex"

    modalTitlVar.innerText = Title;
    modalTxtVar.innerText = Info;

    if (OKtext == null) {
        mdlBtnOKVar.style.display = "none";
    } else {
        mdlBtnOKVar.style.display = "inline";
        mdlBtnOKVar.innerText = OKtext;
        mdlBtnOKVar.addEventListener('click', OKaction);
    }

    mdlBtnNOVar.innerText = NOtext;
    mdlBtnNOVar.addEventListener('click', function() {
        closeModal()  
    } );

}

const table = document.querySelector('.spreadsheet')
let isDragging = false;
let startCell = null;

function debounce(func, timeout = 100) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

table.addEventListener("mousedown", (e) => {
    if (e.target.tagName == "TD") {
        isDragging = true;
        startCell = e.target;
        clearSelection();

        if (e.target.contentEditable == "true") {
            e.target.classList.add("selected");
        }
    }
})

table.addEventListener('mousemove', debounce((e) => {
    if (!isDragging) return;

    if (e.target.tagName == 'TD') {
        const currentCell = e.target;
        selectCells(startCell, currentCell);
    }
}, 15));

table.addEventListener('mouseup', function () {
    isDragging = false;
    startCell = null;
});

function clearSelection() {
    const selectedCells = document.querySelectorAll('.selected');
    selectedCells.forEach(cell => {
        cell.classList.remove('selected');
        cell.removeAttribute('class');
    })
}

function selectCells(startCell, endCell) {
    clearSelection();

    const startRow = startCell.parentElement.rowIndex;
    const startCol = startCell.cellIndex;
    const endRow = endCell.parentElement.rowIndex;
    const endCol = endCell.cellIndex;

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    for (let row = minRow; row <= maxRow; row++) {
        const currentRow = table.rows[row];
        for (let col = minCol; col <= maxCol; col++) {
            const currentCell = currentRow.cells[col];

            if (currentCell.contentEditable == "true") {
                currentCell.classList.add('selected');
            }
        }
    }
}

navVar.addEventListener('mouseover', function () { navover = 1; });
navVar.addEventListener('mouseout', function () { navover = 0; });

window.addEventListener('click', function () {
    if (navover == 0) {
        menuVar.style.display = 'none';
    }
});

generateSpreadsheet();
