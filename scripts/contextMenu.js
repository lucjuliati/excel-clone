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
    let location = locationIndicator.innerHTML;
    const cell = document.querySelector(`td[data-location="${location}"]`);
        
    if (cell != null) {
        cell.innerHTML = ""
        cell.style.backgroundColor = "#ffffff";
        cell.style.color = "#000000";
        cell.dataset.bg = "#ffffff";
        cell.dataset.color = "#000000";
    }

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
        let location = locationIndicator.innerHTML;
        const cell = document.querySelector(`td[data-location="${location}"]`);
        
        if (cell != null) {
            if (type == "background") {
                cell.style.backgroundColor = color;
                cell.dataset.bg = color;
            } else if (type == "text") {
                cell.style.color = color;
                cell.dataset.color = color;
            }
        }
    }

    input.remove()
}