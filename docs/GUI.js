import Mastermind from "./Mastermind.js";
import Winner from "./Winner.js";

class GUI {
    constructor() {
        this.game = null;
        this.selectedColor = null;
        this.colors = ["blue", "red", "green", "yellow", "cyan", "magenta", "orange", "lime"];
    }
    init() {
        let s = document.querySelector("#numberOfCodes");
        let numberOfCodes = parseInt(s.value);
        s = document.querySelector("#numberOfColors");
        let numberOfColors = parseInt(s.value);
        s = document.querySelector("#numberOfTries");
        let numberOfTries = parseInt(s.value);
        this.game = new Mastermind(numberOfColors, numberOfCodes, numberOfTries);
        this.printBoard();
        this.printColors();
        this.setMessage("");
        this.setActiveRow();
    }
    registerEvents() {
        let button = document.querySelector("#check");
        button.onclick = this.check.bind(this);
        button = document.querySelector("#start");
        button.onclick = this.init;
        this.init();
    }
    printBoard() {
        let tbody = document.querySelector("#board tbody");
        tbody.innerHTML = "";

        for (let i = 0; i < this.game.getNumOfTries(); i++) {
            let tr = document.createElement("tr");
            tbody.appendChild(tr);
            for (let j = 0; j < this.game.getNumOfCodes(); j++) {
                tr.appendChild(document.createElement("td"));
            }
            tr.appendChild(document.createElement("td"));
            tr.appendChild(document.createElement("td"));
        }
    }
    printColors() {
        let table = document.querySelector("#colors");
        table.innerHTML = "";

        let tr = document.createElement("tr");
        table.appendChild(tr);

        for (let i = 0; i < this.game.getNumOfColors(); i++) {
            if (i === Math.round(this.game.getNumOfColors() / 2)) {
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
        this.selectedColor = ev.target.style.backgroundColor;
    }
    setRowColor(ev) {
        ev.target.style.backgroundColor = this.selectedColor;
        ev.target.style.borderColor = this.selectedColor;
    }
    setMessage(text) {
        let ret = document.querySelector("#message");
        ret.textContent = text;
    }
    setActiveRow() {
        let cells = document.querySelectorAll(`#board > tbody > tr:not(:nth-child(${this.game.getNumOfTries()})) > td:not(:last-child)`);
        cells.forEach(elem => elem.removeEventListener("click", this.setRowColor.bind(this)));
        let cells2 = document.querySelectorAll(`#board > tbody > tr:nth-child(${this.game.getNumOfTries()}) > td:not(:last-child)`);
        cells2.forEach(elem => elem.addEventListener("click", this.setRowColor.bind(this)));
    }
    check() {
        let cells = document.querySelectorAll(`#board > tbody > tr:nth-child(${this.game.getNumOfTries()}) > td`);
        let result = [];
        for (let i = 0; i < this.game.getNumOfCodes(); i++) {
            let corDeFundo = cells[i].style.backgroundColor;
            let colorIndex = this.colors.indexOf(corDeFundo);
            result.push(colorIndex);
        }
        try {
            let ret = this.game.play(result);
            this.showHint(ret.getHint());
            if (ret.getWinner() === Winner.WIN) {
                this.setMessage("Game over. You win!");
            } else if (ret.getWinner() === Winner.LOSE) {
                this.setMessage("Game over. You lose!");
            } else {
                this.setActiveRow();
            }
        } catch (ex) {
            this.setMessage(ex.message);
        }
    }
    showHint(result) {
        let correctCell = document.querySelector(`#board > tbody > tr:nth-child(${this.game.getNumOfTries() + 1}) > td:nth-last-child(2)`);
        correctCell.textContent = result.filter(n => n == 2).length;
        let wrongCell = document.querySelector(`#board > tbody > tr:nth-child(${this.game.getNumOfTries() + 1}) > td:last-child`);
        wrongCell.textContent = result.filter(n => n == 1).length;
    }
}

let gui = new GUI();
gui.registerEvents();