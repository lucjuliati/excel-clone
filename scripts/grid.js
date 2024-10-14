const spreadsheet = document.querySelector(".spreadsheet");
const tableHeader = spreadsheet.querySelector("thead tr");
const tableBody = spreadsheet.querySelector("tbody");
const locationIndicator = document.querySelector("#location");
let isDragging = false;
let startCell = null;

let numRows = 50;
let numCols = 27;

function generateSpreadsheet(file = null) {
    tableBody.querySelectorAll("tr").forEach((e) => e.remove())
    tableHeader.innerHTML = ""

    const header = [''].concat(Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)));

    if (file) {
        document.title = file.title;
        numRows = file.rows;
        numCols = file.columns;
    }

    for (let i = 0; i < numCols; i++) {
        let th = document.createElement("th");
        th.innerHTML = header[i] ?? "";
        tableHeader.appendChild(th);
    }

    for (let i = 1; i <= numRows; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < numCols; j++) {
            const letter = header[j] ?? "";
            const cell = document.createElement('td');

            if (j === 0) {
                cell.setAttribute("class", "row-counter");
                cell.innerHTML = i;
            } else {
                const location = `${letter}${i}`
                cell.setAttribute("contenteditable", "");
                cell.setAttribute("spellcheck", false)
                cell.setAttribute("data-location", location);
                cell.setAttribute("data-type", "text");

                if (file != null && file?.data?.[location]) {
                    cell.textContent = file.data[location].content;
                    cell.style.color = file.data[location].color;
                    cell.style.backgroundColor = file.data[location].bg;
                    cell.setAttribute("data-bg", file.data[location].bg);
                    cell.setAttribute("data-color", file.data[location].color);
                } else {
                    cell.setAttribute("data-bg", "#ffffff");
                    cell.setAttribute("data-color", "#000000");
                }

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

function save() {
    const cells = tableBody.querySelectorAll("td[contenteditable]");

    let file = {
        title: document.title,
        rows: numRows,
        columns: numCols,
        data: {}
    }

    cells.forEach((cell) => {
        if (cell.textContent != "" && cell.dataset?.location) {
            file.data[cell.dataset?.location] = {
                "type": cell.dataset?.type,
                "color": cell.dataset.color ?? "#000000",
                "bg": cell.dataset.bg ?? "#fffffff",
                "location": cell.dataset?.location,
                "content": cell.textContent
            };
        }
    });

    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
    let downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", document.title + ".json");
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

function debounce(func, timeout = 100) {
    let timer;

    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout);
    };
}

spreadsheet.addEventListener("mousedown", (e) => {
    if (e.target.tagName == "TD" && e.button == 0) {
        isDragging = true;
        startCell = e.target;
        clearSelection();

        if (e.target.contentEditable == "true") {
            e.target.classList.add("selected");
        }
    }
})

spreadsheet.addEventListener('mousemove', debounce((e) => {
    if (!isDragging) return;

    if (e.target.tagName == 'TD') {
        const currentCell = e.target;
        selectCells(startCell, currentCell);
    }
}, 15));

spreadsheet.addEventListener('mouseup', function () {
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
        const currentRow = spreadsheet.rows[row];
        for (let col = minCol; col <= maxCol; col++) {
            const currentCell = currentRow.cells[col];

            if (currentCell.contentEditable == "true") {
                currentCell.classList.add('selected');
            }
        }
    }
}

function updateSpreadsheet() {
    
    if ((document.getElementById('tf').value + document.getElementById('bf').value) == "") {
        notice("You didn't type any value!");
        
    } else {
        
    } if ((document.getElementById('tf').value + document.getElementById('bf').value) * 0 == 0) {

        numRows = document.getElementById('tf').value;
        numCols = document.getElementById('bf').value;
        numCols++;

        generateSpreadsheet();

        notice("Spreadsheet size updated!");
        
    } else {
        notice("An invalid value was entered, please try again");
    }
    
}

generateSpreadsheet();