let buttons = document.querySelectorAll('nav button');
let menuVar = document.getElementById('menuShow');
let navVar = document.getElementById('nav');

let navover;

menus = {
    fileMenu: [
        { name: "New", disable: false, action: function() { 
            sendModal("New document?", "Any progress made will be discarded", "Discard anyway", function() {location.reload()}, "Cancel")
        } },
        { name: "Open", disable: false, action: open },
        { name: "Save", disable: false, action: save }
    ],
    editMenu: [
        { name: "Un-do", disable: true, action: function() { alert() } },
        { name: "Re-do", disable: true, action: function() { alert() } },
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


navVar.addEventListener('mouseover', function () { navover = 1; });
navVar.addEventListener('mouseout', function () { navover = 0; });

window.addEventListener('click', function () {
    if (navover == 0) {
        menuVar.style.display = 'none';
    }
});

// * MODAL

let modalBGVar = document.getElementById('modalBG')
let modalTitleVar = document.getElementById('modalTitle')
let modalTxtVar = document.getElementById('modalTxt')
let mdlBtnOKVar = document.getElementById('mdlBtnOK')
let mdlBtnNOVar = document.getElementById('mdlBtnNO')


function closeModal() {
    modalBGVar.style.display = "none";
}

function sendModal(Title, Info, OKtext, OKaction, NOtext) {
    
    modalBGVar.style.display = "flex"

    modalTitleVar.innerText = Title;
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