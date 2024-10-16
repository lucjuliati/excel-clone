const contextMenu = document.getElementById('contextMenu');

tableBody.addEventListener('contextmenu', (e) => {
    locationIndicator.innerHTML = e.target.dataset?.location;
    e.preventDefault();

    contextMenu.style.top = `${e.clientY + window.scrollY}px`;
    contextMenu.style.left = `${e.clientX + window.scrollX}px`;

    contextMenu.style.display = 'block';
});

tableBody.addEventListener('click', (e) => {
    if (!contextMenu.contains(e.target)) {
        contextMenu.style.display = 'none';
    }
});

function clearCell(e) {
    let selected = document.querySelectorAll("td.selected");

    selected.forEach((cell) => {
        cell.innerHTML = ""
        cell.style.backgroundColor = "#ffffff";
        cell.style.color = "#000000";
        cell.dataset.bg = "#ffffff";
        cell.dataset.type = "text";
        cell.dataset.color = "#000000";
        cell.removeAttribute("data-checked")
    });

    selected.forEach((cell) => {
        cell.classList.remove("selected")
    })

    contextMenu.style.display = 'none';
}

function changeColor(e, type) {
    const input = document.createElement("input");
    input.setAttribute("type", "color");
    input.setAttribute("value", type == "text" ? "#000000" : "#ffffff");
    document.body.appendChild(input);
    contextMenu.style.display = 'none';
    input.click();

    input.onchange = (e) => {
        let color = e.target.value;
        let selected = document.querySelectorAll("td.selected");

        selected.forEach((cell) => {
            if (type == "background") {
                cell.style.backgroundColor = color;
                cell.dataset.bg = color;
            } else if (type == "text") {
                cell.style.color = color;
                cell.dataset.color = color;
            }
        });

        documentChanged = true;
    }

    input.remove();
}

function changeType(e) {
    let selected = document.querySelectorAll("td.selected");
    const typeSelect = document.querySelector("#typeSelect")

    selected.forEach((cell) => {
        cell.dataset.type = e.value;

        if (e.value == "checkbox") {
            cell.innerHTML = `<input type="checkbox" />`;
            cell.dataset.checked = "0"
        }
    })

    documentChanged = true;
    contextMenu.style.display = 'none';
    typeSelect.value = "text"
}
