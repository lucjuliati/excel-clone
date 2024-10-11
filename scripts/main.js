

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

let button = document.getElementsByTagName('button');
let menuVar = document.getElementById('menuShow');


fileMenu = [
    {name:"New", disable:"true", action: "alert()"},
    {name:"Open", disable:"true", action: "alert()"},
    {name:"Save", disable:"true", action: "alert()"}
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
    menuVar.style.left = getOffset(e)+"px";

    let current = e.textContent.toLocaleLowerCase()+"Menu";

    let values = menus[current];

    menuVar.innerHTML = "";

    for (let i = 0; i < menus[current].length; i++) {
        console.log(values[i].name);
        var div = document.createElement('div');
        div.innerText = values[i].name;
        menuVar.appendChild(div);
        
    }
    
    
}));

generateSpreadsheet()