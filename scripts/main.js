let buttons = document.querySelectorAll('nav button');
let menuVar = document.getElementById('menuShow');
let navVar = document.getElementById('nav');
let navover = 0;

let modalBGVar = document.getElementById('modalBG');
let modalTitleVar = document.getElementById('modalTitle');
let modalTxtVar = document.getElementById('modalTxt');
let modalCont = document.getElementById('modalCont');
let mdlBtnOKVar = document.getElementById('mdlBtnOK');
let mdlBtnNOVar = document.getElementById('mdlBtnNO');
let documentChanged = false
let current = 0;
let old = 0;

let infoVar = document.getElementById('info');
let infotextVar = document.getElementById('infotext');

let titleVar = document.getElementById('documentName');

let documentStatusVar = document.getElementById('documentStatus');
let statusBackup;
// !

titleVar.addEventListener('click', function() { 
    sendModal("Update document name",
        "Please enter a new name",
        "Update",
        function() {
            titleVar.textContent = document.getElementById('tf').value;
            document.title = titleVar.textContent;
            documentChanged = true;
        },
        "Cancel",
        "Name",
    )
})

menus = {
    fileMenu: [
        { name: "New", disable: false, action: function() { 
            sendModal("New document?",
                "Any progress made will be discarded, are you sure?",
                "Yes",
                function() {location.reload()},
                "Cancel",
            )
        } },
        { name: "Open", disable: false, action: open },
        { name: "Save", disable: false, action: save },
    ],
    editMenu: [
        { name: "Un-do", disable: true, action: null },
        { name: "Re-do", disable: true, action: null },
        { name: "Edit document size", disable:false, action: function() { 
            sendModal("Edit document size",
                "Please enter a value in the following fields", 
                "Update",
                updateSpreadsheet,
                "Cancel",
                "Rows",
                "Columns"
            )
        } },
        { name: `Toggle auto-backup: ${statusBackup}`, disable: false, action: function() {

        } }
    ],
    helpMenu: [
        { name: "About", disable: false, action: function() { 
            sendModal("Excells",
                "Version: ALPHA 0.5.0 (1412)\nBranch version: func-general-1410\nMinimal excel clone with import and export functions!\nMade by Bre and Sif",
                null,
                null,
                "Nice :)",
            )
        } }
    ],
    debugMenu: []
};

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return rect.left;
}

Array.from(buttons).forEach(e => e.addEventListener('click', () => {
    menuVar.style.display = 'block';
    menuVar.style.left = getOffset(e) + "px";

    let current = e.textContent.toLocaleLowerCase() + "Menu";
    let values = menus[current];

    menuVar.innerHTML = "";

    let size = 0;

    old = 0;

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

        current = (values[i].name).length * 5 + 100;

        if ( current >= old) {

            old = current;
            menuVar.style.width = old + "px";

        }
        
    }

    menuVar.style.height = size + "px";

}));

function closeModal() {
    modalBGVar.style.display = "none";
}

function sendModal(Title, Info, OKtext, OKaction, NOtext, fieldTop = null, fieldBtm = null) {
    
    modalBGVar.style.display = "flex"

    modalTitleVar.innerText = Title;
    modalTxtVar.innerText = Info;

    if (OKtext == null) {
        mdlBtnOKVar.style.display = "none";
    } else {
        mdlBtnOKVar.style.display = "inline";
        mdlBtnOKVar.innerText = OKtext;
        mdlBtnOKVar.addEventListener('click', OKaction);
        mdlBtnOKVar.addEventListener('click', closeModal);
    }

    mdlBtnNOVar.innerText = NOtext;
    mdlBtnNOVar.addEventListener('click', function() {
        closeModal()  
    } );

    modalCont.innerHTML = ""

    if (fieldTop != null) {

        modalCont.innerHTML = `
            <label for='tf'>${fieldTop}
            <input id='tf' type='text'>
            </label>
        `;
    }

    if (fieldBtm != null) {

        modalCont.innerHTML = modalCont.innerHTML + `
            <label for='bf'>${fieldBtm}
            <input id='bf' type='text'>
            </label>
        `;
    }

}

navVar.addEventListener('mouseover', function () { navover = 1; });
navVar.addEventListener('mouseout', function () { navover = 0; });

window.addEventListener('click', function () {
    if (navover == 0) {
        menuVar.style.display = 'none';
    }
});

function notice(text) {
    infotextVar.textContent = text;
    infoVar.style.width =  (text.length * 8 + 100) + "px";
    infoVar.style.transition = "top 0.2s";
    infoVar.style.top = "90%"
    setTimeout(() => {
        infoVar.style.top = "110%"
    }, 5000);
}

window.addEventListener('beforeunload', (e) => {
    if (!documentChanged) return

    if (modalTitleVar.innerText != "New document?" ) {

        e.preventDefault(); 
        
        return; 

    } else {

    }

});

function loadBackup(){

}

function checkBackup(){
    
}

setInterval(() => {
    checkBackup();
}, 10000);
