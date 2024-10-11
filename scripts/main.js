
function generateSpreadsheet() {
    const spreadsheet = document.querySelector(".spreadsheet")
    let matrix = []

    for (let i = 0; i < 26; i++) {
        let row = []
        for (let j = 0; j < 100; j++) {
            row.push(j)
        }

        matrix.push(row)
    }

    matrix.forEach((row) => {
        row.forEach((item) => {
            const cell = document.createElement("input")
            cell.setAttribute("class", "cell")
            cell.setAttribute("type", "text")
            spreadsheet.appendChild(cell)
        })
    })
}

generateSpreadsheet()