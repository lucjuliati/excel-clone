

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
    {name:"New", disable:false, action: "alert()"},
    {name:"Open", disable:true, action: "alert()"},
    {name:"Save", disable:true, action: "alert()"}
]

editMenu = [
    {name:"Un-do", disable:true, action: "alert()"},
    {name:"Re-do", disable:false, action: "alert()"},
]

helpMenu = [
    {name:"About", disable:false, action: "alert()"}
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

    let size = 0;

    for (let i = 0; i < values.length; i++) {
        
        var div = document.createElement('div');

        div.innerText = values[i].name;

        values[i].disable ? div.style.color = '#898989' : div.style.color = '#000';
        values[i].disable ? null : div.className = "hovermenu" ; 

        div.style.fontFamily = 'Arial, Helvetica, sans-serif';
        div.style.userSelect = 'none';
        div.style.padding = '5px';

        size += 28;


        menuVar.appendChild(div);
        
    }

    menuVar.style.height = size +"px";
    
}));

generateSpreadsheet()