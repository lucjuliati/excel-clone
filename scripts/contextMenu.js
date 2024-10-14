const contextMenu = document.getElementById('contextMenu');

tableBody.addEventListener('contextmenu', (e) => {
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