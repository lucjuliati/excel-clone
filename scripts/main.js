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
                cell.onclick = (e) => handleCellClick(e);
            }

            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }
}

function save() {
    const elements = spreadsheet.querySelectorAll("td[contenteditable]");
    let document = {};

    elements.forEach((e) => {
        const key = e.dataset.location;
        
        if (e.textContent != "") {
            document[key] = e.textContent;
        }
    })

    console.log(document)
}

function handleCellClick(e) {
    if (e.target.dataset?.location) {
        locationIndicator.innerHTML = e.target.dataset?.location;
    }
}

let buttons = document.querySelectorAll('nav button');
let menuVar = document.getElementById('menuShow');
var navVar = document.getElementById('nav');
var navover;

menus = {
    fileMenu: [
        { name: "New", disable: false, action: "alert()" },
        { name: "Open", disable: true, action: "alert()" },
        { name: "Save", disable: true, action: "alert()" }
    ],
    editMenu: [
        { name: "Un-do", disable: true, action: "alert()" },
        { name: "Re-do", disable: false, action: "alert()" },
    ],
    helpMenu: [
        { name: "About", disable: false, action: "alert()" }
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

        values[i].disable ? div.style.color = '#898989' : div.style.color = '#000';
        values[i].disable ? null : div.className = "hovermenu";

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
        menuVar.style.height = "0px";
        menuVar.innerHTML = "";
    }
});

generateSpreadsheet();
