

function generateSpreadsheet() {
    const spreadsheet = document.querySelector(".spreadsheet")
    const tableHeader = spreadsheet.querySelector("thead tr")
    const tableBody = spreadsheet.querySelector("tbody")
    const numRows = 50
    const numCols = 27

    const headerItems = [
        '', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ]

    for (let i = 0; i < numCols; i++) {
        let th = document.createElement("th")
        th.innerHTML = headerItems[i] ?? ""
        tableHeader.appendChild(th)
    }

    for (let i = 0; i <= numRows; i++) {
        const row = document.createElement('tr')

        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement('td')
            if (j === 0) {
                cell.setAttribute("class", "row-counter")
                cell.innerHTML = `<span>${i}</span>`
            } else {
                cell.setAttribute("contenteditable", "")
            }

            row.appendChild(cell)
        }

        tableBody.appendChild(row)
    }
}

let button = document.querySelectorAll('nav button');
let menuVar = document.getElementById('menuShow');


fileMenu = [
    { name: "New", disable: false, action: "alert()" },
    { name: "Open", disable: true, action: "alert()" },
    { name: "Save", disable: true, action: "alert()" }
]

editMenu = [
    { name: "Un-do", disable: true, action: "alert()" },
    { name: "Re-do", disable: false, action: "alert()" },
]

helpMenu = [
    { name: "About", disable: false, action: "alert()" }
]

menus = {
    fileMenu: fileMenu,
    editMenu: editMenu,
    helpMenu: helpMenu
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return rect.left + window.scrollX;
}

Array.from(button).forEach(e => e.addEventListener('click', () => {
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


        menuVar.appendChild(div);

    }

    menuVar.style.height = size + "px";

}));

const table = document.querySelector('.spreadsheet')
let isDragging = false
let startCell = null

table.addEventListener('mousedown', (e) => {
    if (e.target.tagName == 'TD') {
        isDragging = true
        startCell = e.target
        clearSelection()
        e.target.classList.add('selected')
    }
})

// TODO: add debouncer to this listener
table.addEventListener('mousemove', (e) => {
    if (e.target.tagName == 'TD' && isDragging) {
        const currentCell = e.target
        selectCells(startCell, currentCell)
    }
})

table.addEventListener('mouseup', function () {
    isDragging = false
    startCell = null
})

function clearSelection() {
    const selectedCells = document.querySelectorAll('.selected')
    selectedCells.forEach(cell => cell.classList.remove('selected'))
}

function selectCells(startCell, endCell) {
    clearSelection()

    const startRow = startCell.parentElement.rowIndex
    const startCol = startCell.cellIndex
    const endRow = endCell.parentElement.rowIndex
    const endCol = endCell.cellIndex

    const minRow = Math.min(startRow, endRow)
    const maxRow = Math.max(startRow, endRow)
    const minCol = Math.min(startCol, endCol)
    const maxCol = Math.max(startCol, endCol)

    for (let row = minRow; row <= maxRow; row++) {
        const currentRow = table.rows[row]
        for (let col = minCol; col <= maxCol; col++) {
            const currentCell = currentRow.cells[col]
            currentCell.classList.add('selected')
        }
    }
}


generateSpreadsheet()