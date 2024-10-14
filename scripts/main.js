const spreadsheet = document.querySelector(".spreadsheet");
const tableHeader = spreadsheet.querySelector("thead tr");
const tableBody = spreadsheet.querySelector("tbody");
const locationIndicator = document.querySelector("#location");

function generateSpreadsheet(file = null) {
    let numRows = 50;
    let numCols = 27;

    if (file) {
        tableBody.querySelectorAll("tr").forEach((e) => e.remove())
        tableHeader.innerHTML = ""

        numRows = file.rows;
        numCols = file.columns + 1;
    }

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

function save() {
    const cells = tableBody.querySelectorAll("td[contenteditable]");

    let file = {
        title: document.title ?? "",
        rows: 50,
        columns: 27,
        data: []
    }

    cells.forEach((cell) => {
        if (cell.textContent != "") {
            file.data.push({
                "type": cell.dataset?.type,
                "color": cell.dataset?.color,
                "location": cell.dataset?.location,
                "content": cell.textContent
            });
        }
    });

    let timestamp = new Date().getTime()
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
    let downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", timestamp + ".json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function open() {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "application/JSON");
    document.body.appendChild(input);
    input.click();

    input.onchange = (e) => {
        try {
            let file = e.target.files?.[0];
            const reader = new FileReader(); 

            reader.onload = (event) => {
                const jsonContent = JSON.parse(event.target.result);
                if (!jsonContent.columns || !jsonContent.rows) throw new Error()
                generateSpreadsheet(jsonContent)
            };

            reader.onerror = (error) => { 
                throw new Error();
            }

            reader.readAsText(file);  
        } catch (err) {
            console.error(err)
            alert("Error while reading the provided file!")
        }
    };

    input.remove();
}

generateSpreadsheet();
