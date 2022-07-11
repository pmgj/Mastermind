class GUI {
    constructor() {
        this.currentRow = 0;
        this.currentCol = 0;
        this.currentCode = []
        this.colors = ["blue", "red", "green", "yellow", "brown", "magenta", "orange", "silver"];
        this.xhr = new XMLHttpRequest();
        this.type = "Servlet";
        this.thead = document.querySelector("#board thead");
        this.tbody = document.querySelector("#board tbody");
        let button = document.querySelector("#start");
        button.onclick = this.init.bind(this);
        this.numOfCodes = 0;
        this.numOfColors = 0;
    }
    addColor(color) {
        if (this.currentCode.length >= this.numOfCodes) {
            return;
        }
        this.currentCode.push(this.colors.indexOf(color));
        let td = this.tbody.rows[this.currentRow].cells[this.currentCol];
        td.style.backgroundColor = color;
        td.style.borderColor = color;
        this.currentCol++;
    }
    removeColor() {
        if (this.currentCol === 0) {
            return;
        }
        this.currentCode.pop();
        this.currentCol--;
        let td = this.tbody.rows[this.currentRow].cells[this.currentCol];
        td.style.backgroundColor = "white";
        td.style.borderColor = "gray";
    }
    init() {
        let s = document.querySelector("#numberOfCodes");
        let numberOfCodes = parseInt(s.value);
        s = document.querySelector("#numberOfColors");
        let numberOfColors = parseInt(s.value);
        s = document.querySelector("#numberOfTries");
        let numberOfTries = parseInt(s.value);
        this.numOfCodes = numberOfCodes;
        this.numOfColors = numberOfColors;
        if (numberOfCodes > numberOfColors) {
            this.writeResponse("The number of codes must be less than or equal to the number of colors!");
        } else {
            this.printBoard(numberOfCodes, numberOfTries);
            this.printColors(numberOfColors);
            this.setMessage("");
            this.currentRow = numberOfTries - 1;
            this.currentCol = 0;
            this.currentCode = [];
            this.registerEvents();
            this.xhr.onreadystatechange = undefined;
            let formData = new FormData();
            formData.append("numberOfColors", numberOfColors);
            formData.append("numberOfCodes", numberOfCodes);
            formData.append("numberOfTries", numberOfTries);
            if (this.type == "Servlet") {
                this.xhr.open("post", "ServletMastermind");
                this.xhr.send(formData);
            } else {
                this.xhr.open("post", "webresources/mastermind");
                this.xhr.setRequestHeader("Content-Type", "application/json");
                this.xhr.send(JSON.stringify(Object.fromEntries(formData)));
            }
        }
    }
    printBoard(numberOfCodes, numberOfTries) {
        this.thead.innerHTML = "";
        let tr = document.createElement("tr");
        this.thead.appendChild(tr);
        for (let i = 0; i < numberOfCodes; i++) {
            tr.appendChild(document.createElement("td"));
        }
        this.tbody.innerHTML = "";
        for (let i = 0; i < numberOfTries; i++) {
            tr = document.createElement("tr");
            this.tbody.appendChild(tr);
            for (let j = 0; j < numberOfCodes; j++) {
                tr.appendChild(document.createElement("td"));
            }
            tr.appendChild(document.createElement("td"));
            tr.appendChild(document.createElement("td"));
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
    setColor(ev) {
        this.addColor(ev.target.style.backgroundColor);
    }
    setMessage(text) {
        let ret = document.querySelector("#message");
        ret.textContent = text;
    }
    showAnswer(answer) {
        let tds = this.thead.querySelectorAll("td");
        for (let i = 0; i < tds.length; i++) {
            tds[i].style.backgroundColor = this.colors[answer[i]];
            tds[i].style.borderColor = this.colors[answer[i]];
        }
    }
    showHint(result) {
        let correctCell = this.tbody.querySelector(`tr:nth-child(${this.currentRow + 1}) td:nth-last-child(2)`);
        correctCell.textContent = result.filter(n => n == 2).length;
        let wrongCell = this.tbody.querySelector(`tr:nth-child(${this.currentRow + 1}) td:last-child`);
        wrongCell.textContent = result.filter(n => n == 1).length;
    }
    check() {
        this.xhr.onreadystatechange = this.printOutput.bind(this);
        if (this.type == "Servlet") {
            this.xhr.open("put", "ServletMastermind");
        } else {
            this.xhr.open("put", "webresources/mastermind");
            this.xhr.setRequestHeader("Content-Type", "application/json");
        }
        this.xhr.send(JSON.stringify(this.currentCode));
    }
    printOutput() {
        if (this.xhr.readyState === 4) {
            let result = JSON.parse(this.xhr.responseText);
            this.showHint(result.code);
            switch (result.state) {
                case "WIN":
                    this.showAnswer(result.password);
                    this.setMessage("You won!");
                    this.unregisterEvents();
                    break;
                case "LOSE":
                    this.showAnswer(result.password);
                    this.setMessage("You lost!");
                    this.unregisterEvents();
                    break;
                default:
                    this.setMessage("");
                    this.currentRow--;
                    this.currentCol = 0;
                    this.currentCode = [];
                }
        }
    }
    registerEvents() {
        let button = document.querySelector("#check");
        button.onclick = this.check.bind(this);
        button = document.querySelector("#backspace");
        button.onclick = this.removeColor.bind(this);
    }
    unregisterEvents() {
        let button = document.querySelector("#check");
        button.onclick = undefined;
        button = document.querySelector("#backspace");
        button.onclick = undefined;
    }
}
let m = new GUI();
m.init();