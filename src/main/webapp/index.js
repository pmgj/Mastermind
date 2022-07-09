class GUI {
    constructor() {
        this.round = 0;
        this.selectedColor = null;
        this.colors = ["blue", "red", "green", "yellow", "brown", "magenta", "orange", "silver"];
        this.xhr = new XMLHttpRequest();
    }
    setColor(ev) {
        this.selectedColor = ev.target.style.backgroundColor;
    }
    setColor(ev) {
        this.selectedColor = ev.target.style.backgroundColor;
    }
    setColor2(ev) {
        ev.target.style.backgroundColor = this.selectedColor;
    }
    printBoard(numberOfCodes, numberOfTries) {
        let thead = document.querySelector("#board thead");
        thead.innerHTML = "";
        let tr = document.createElement("tr");
        thead.appendChild(tr);
        for (let i = 0; i <= numberOfCodes; i++) {
            tr.appendChild(document.createElement("td"));
        }
        let tbody = document.querySelector("#board tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < numberOfTries; i++) {
            tr = document.createElement("tr");
            tbody.appendChild(tr);
            for (let j = 0; j < numberOfCodes; j++) {
                tr.appendChild(document.createElement("td"));
            }
            let ltd = document.createElement("td");
            tr.appendChild(ltd);
            let table = document.createElement("table");
            ltd.appendChild(table);
            tr = document.createElement("tr");
            table.appendChild(tr);
            for (let k = 0; k < numberOfCodes; k++) {
                if (k === Math.round(numberOfCodes / 2)) {
                    tr = document.createElement("tr");
                    table.appendChild(tr);
                }
                let td = document.createElement("td");
                tr.appendChild(td);
            }
        }
    }
    printColors(numberOfColors) {
        let table = document.querySelector("#colors");
        table.innerHTML = "";
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for (let i = 0; i < numberOfColors; i++) {
            if (i === Math.round(numberOfColors / 2)) {
                tr = document.createElement("tr");
                table.appendChild(tr);
            }
            let td = document.createElement("td");
            tr.appendChild(td);
        }
        let tds = document.querySelectorAll("#colors td");
        tds.forEach((elem, index) => {
            elem.style.backgroundColor = this.colors[index];
            elem.onclick = this.setColor.bind(this);
        });
    }
    currentLine() {
        let cells = document.querySelectorAll(`#board > tbody > tr:not(:nth-child(${this.round})) > td:not(:last-child)`);
        cells.forEach(elem => elem.onclick = null, this);
        let cells2 = document.querySelectorAll(`#board > tbody > tr:nth-child(${this.round}) > td:not(:last-child)`);
        cells2.forEach(elem => elem.onclick = this.setColor2.bind(this), this);
    }
    printResult(result) {
        let cells = document.querySelectorAll(`#board > tbody > tr:nth-child(${this.round}) > td:last-child td`);
        let colors = ["white", "gray", "red"];
        for (let i = 0; i < result.length; i++) {
            cells[i].style.backgroundColor = colors[result[i]];
        }
    }
    printResponse(result) {
        let cells = document.querySelectorAll("#board thead td:not(:last-child)");
        cells.forEach((elem, index) => elem.style.backgroundColor = this.colors[result[index]], this);
    }
    check() {
        let cells = document.querySelectorAll(`#board > tbody > tr:nth-child(${this.round}) > td:not(:last-child)`);
        let result = [];
        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            let corDeFundo = cell.style.backgroundColor;
            if (corDeFundo === "") {
                this.writeResponse("All colors should be informed!");
                return;
            }
            let colorIndex = this.colors.indexOf(corDeFundo);
            if (result.indexOf(colorIndex) !== -1) {
                this.writeResponse("There must not be repeated colors!");
                return;
            }
            result[i] = colorIndex;
        }
        this.xhr.onreadystatechange = this.printOutput.bind(this, result);
        this.xhr.open("put", "ServletMastermind");
        this.xhr.send(JSON.stringify(result));
    }
    printOutput(password) {
        if (this.xhr.readyState === 4) {
            let result = JSON.parse(this.xhr.responseText);
            this.printResult(result.code);
            switch (result.state) {
                case "WIN":
                    this.printResponse(password);
                    this.writeResponse("You won!");
                    break;
                case "LOSE":
                    this.printResponse(result.password);
                    this.writeResponse("You lost!");
                    break;
                default:
                    this.writeResponse("");
                    this.round--;
                    this.currentLine();
            }
        }
    }
    writeResponse(text) {
        let ret = document.querySelector("#output");
        ret.textContent = text;
    }
    enableButtons() {
        let button = document.querySelector("#check");
        button.onclick = this.check.bind(this);
        button = document.querySelector("#start");
        button.onclick = this.init.bind(this);
    }
    init() {
        let s = document.querySelector("#numberOfCodes");
        let numberOfCodes = parseInt(s.value);
        s = document.querySelector("#numberOfColors");
        let numberOfColors = parseInt(s.value);
        s = document.querySelector("#numberOfTries");
        let numberOfTries = parseInt(s.value);
        this.round = numberOfTries;
        if (numberOfCodes > numberOfColors) {
            this.writeResponse("The number of codes must be less than or equal to the number of colors!");
        } else {
            this.printBoard(numberOfCodes, numberOfTries);
            this.printColors(numberOfColors);
            this.writeResponse("");
            this.currentLine();
            this.xhr.onreadystatechange = undefined;
            this.xhr.open("post", "ServletMastermind");
            let formData = new FormData(document.forms[0]);
            this.xhr.send(formData);
            this.enableButtons();
        }
    }
}
let m = new GUI();
m.init();