class ColorPicker extends HTMLElement {
    state = {
        value: this.getAttribute("value"),
        history: [this.getAttribute("value")]
    };

    style = `
    button {
        background-color: ${this.state.value};
        padding: 9px 0;
        min-width: 50px;
        height: 12px;
        cursor: pointer;
        border: 1px solid #bababa;
        border-radius: 5px;
        position: relative;
        display: inline;
        &:hover {
            filter: brightness(0.92);
        }
    }
    .color-history {
        margin-left: 2px;
        display: flex;
    }
    .color-item {
        height: 16px;
        width: 16px;
        margin: 0 1px;
        cursor: pointer;
        border-radius: 12px;
        border: 1px solid #bababa;
        &:hover {
            filter: brightness(0.92);
        }
    }`;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = '';
        const button = document.createElement('button');
        const style = document.createElement("style");
        const history = document.createElement("span");
        history.setAttribute("class", "color-history");

        button.addEventListener('click', () => {
            const input = document.createElement("input");
            input.setAttribute("type", "color");
            input.setAttribute("value", this.getAttribute("value"));
            document.body.appendChild(input);
            setTimeout(() => input.click(), 10);

            input.onchange = (e) => {
                let color = e.target.value;
                this.setAttribute("value", color);
                this.state.value = color;

                this.updateColors(color);

                if (!this.state.history.includes(color)) {
                    let history = this.state.history;
                    history.push(color);
                    history = history.slice(-5);
                    this.state.history = history;
                }
               
                this.render();
            }

            input.remove();
        });

        this.state.history.reverse().forEach((color) => {
            let colorItem = document.createElement("div");
            colorItem.setAttribute("class", "color-item");
            colorItem.onclick = (e) => this.updateColors(color);
            colorItem.style.background = color;
            history.appendChild(colorItem);
        })

        style.textContent = this.style;
        button.style.background = this.state.value;
        this.shadowRoot.appendChild(button);
        this.shadowRoot.appendChild(history);
        this.shadowRoot.appendChild(style);
    }

    updateColors(color) {
        const type = this.getAttribute("type");
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
}

customElements.define('color-picker', ColorPicker);