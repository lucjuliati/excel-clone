const spreadsheet = document.querySelector(".spreadsheet");
const tableHeader = spreadsheet.querySelector("thead tr");
const tableBody = spreadsheet.querySelector("tbody");
const locationIndicator = document.querySelector("#location");

let isDragging = false;
let startCell = null;
let numRows = 50;
let numCols = 27;

function generateHeader(size) {
    const header = [];
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < Math.min(size, 26); i++) {
        header.push(letters[i]);
    }

    if (size > 26) {
        let extra = size - 26;
        let i = 0;
        
        while (extra > 0) {
            for (let j = 0; j < 26 && extra > 0; j++) {
                header.push(letters[i] + letters[j]);
                extra--;
            }
            i++;
        }
    }

    return header;
}

function updateHeaderSize(e, rect) {
    const location = e.target.parentElement?.dataset?.location;
    const parent = e.target.parentElement;

    if (location) {
        parent.setAttribute("data-width", rect.width);
        documentChanged = true;
    }
}

function generateSpreadsheet(file = null) {
    tableBody.querySelectorAll("tr").forEach((e) => e.remove());
    tableHeader.innerHTML = "";
    tableHeaderElements = [];

    if (file) {
        document.title = file.title;
        numRows = file.rows;
        numCols = file.columns;
    }

    const header = ["", ...generateHeader(numCols)];

    const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
            if (entry.contentRect.width > 100) {
                updateHeaderSize(entry, entry.contentRect);
            }
        }
    });

    for (let i = 0; i < numCols; i++) {
        let th = document.createElement("th");
        th.setAttribute("data-location", header[i]);

        if (i == 0) {
            th.setAttribute("class", "row-counter");
        } else {
            let div = document.createElement("div");
            div.textContent = header[i] ?? "";
            let data = file?.columnData?.[header[i]];
            
            if (data) {
                th.setAttribute("data-width", data?.width);
                div.style.width = `${data?.width}px`;
            }

            th.appendChild(div);
            resizeObserver.observe(div);
        }

        tableHeaderElements.push(th);
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
                const current = file?.data?.[`${letter}${i}`]
                cell.setAttribute("contenteditable", "");
                cell.setAttribute("spellcheck", false)
                cell.setAttribute("data-location", `${letter}${i}`);
                cell.setAttribute("data-type", "text");

                if (file != null && current) {
                    cell.textContent = current?.content;
                    cell.style.color = current?.color;
                    cell.style.backgroundColor = current?.bg;
                    cell.setAttribute("data-bg", current?.bg);
                    cell.setAttribute("data-color", current?.color);
                    cell.setAttribute("data-type", current?.type ?? "text");

                    if (current?.type == "checkbox") {
                        cell.setAttribute("data-checked", current?.checked ?? "0");

                        if (current?.checked == "1")
                            cell.innerHTML = `<input type="checkbox" checked />`;
                        else
                            cell.innerHTML = `<input type="checkbox" />`;
                    }
                } else {
                    cell.setAttribute("data-bg", "#ffffff");
                    cell.setAttribute("data-color", "#000000");
                }

                cell.onclick = (e) => {
                    if (e.target.dataset?.location) {
                        locationIndicator.innerHTML = e.target.dataset?.location;
                    }

                    if (e.target.dataset.type == "checkbox") {
                        let checkbox = e.target.querySelector('input[type="checkbox"]');

                        if (checkbox != null) {
                            const value = !checkbox.checked;
                            e.target.dataset.checked = value ? "1" : "0";
                            checkbox.checked = value;
                        } else {
                            e.target.removeAttribute("data-checked");
                            e.target.dataset.type = "text";
                        }
                    }
                };
            }

            row.appendChild(cell);
        }

        tableBody.appendChild(row);
    }
}

async function save({ backup = false }) {
    const cells = tableBody.querySelectorAll("td[contenteditable]");
    const columns = tableHeader.querySelectorAll("th[data-width]");

    let file = {
        title: document.title,
        rows: numRows,
        columns: numCols,
        columnData: {},
        data: {}
    };

    columns.forEach((column) => {
        let location = column.dataset?.location;

        file.columnData[location] = {
            "location": location,
            "width": column.dataset?.width ?? "100"
        }
    });

    cells.forEach((cell) => {
        let hasChanged = cell.textContent != "" || cell.dataset.bg != "#ffffff" || cell.dataset.type != "text";
        let location = columns.dataset?.location;

        if ((hasChanged || documentChanged) && location) {
            file.data[location] = {
                "type": cell.dataset?.type,
                "color": cell.dataset.color ?? "#000000",
                "bg": cell.dataset.bg ?? "#ffffff",
                "location": location,
                "type": cell.dataset?.type,
                "checked": cell.dataset?.checked,
                "content": cell.textContent
            };
        }
    });

    if (backup) {
        let statusBackup = localStorage.getItem("status-backup");
        if (statusBackup == "1") {
            localStorage.setItem("backup-data", JSON.stringify(file));
        }
    } else {
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(file));
        let downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", document.title + ".json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }
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
                if (!jsonContent.columns || !jsonContent.rows) throw new Error();
                generateSpreadsheet(jsonContent);
            };

            reader.onerror = (error) => {
                throw new Error();
            }

            reader.readAsText(file);
        } catch (err) {
            console.error(err);
            alert("Error while reading the provided file!");
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

        if (e.target.classList?.length == 0) {
            e.target.classList.add("selected");
        }
    } else if (e.target.tagName == "TD" && e.button == 2) {
        const selected = document.querySelectorAll("td.selected");

        if (selected?.length === 1) {
            clearSelection();
            if (e.target.classList?.length == 0) {
                e.target.classList.add("selected");
            }
        }
    }
})

spreadsheet.addEventListener('mousemove', debounce((e) => {
    if (!isDragging) return;

    if (e.target.tagName == 'TD') {
        const currentCell = e.target;
        selectCells(startCell, currentCell);
    }
}, 9));

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
    let topField = document.getElementById('tf')
    let bottomField = document.getElementById('bf')

    if (topField.value >= 1000)  {
        notice("Error. The document must have less than 1000 rows!");
        return;
    } else if (bottomField.value >= 100) {
        notice("Error. The document must have less than 100 columns!");
        return;
    }

    if ((topField.value + bottomField.value) == "") {
        notice("You didn't type any value!");
        return;
    } 

    if ((topField.value + bottomField.value) * 0 == 0) {

        numRows = topField.value;
        numCols = bottomField.value;
        numCols++;

        generateSpreadsheet();

        notice("Spreadsheet size updated!");

        documentChanged = true;

    } else {
        notice("An invalid value was entered, please try again");
    }
    
}

generateSpreadsheet();