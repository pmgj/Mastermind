import Mastermind from "./Mastermind.js";
import MastermindPlayer from "./MastermindPlayer.js";
import Winner from "./Winner.js";

class GUI {
    constructor() {
        this.game = null;
        this.player = null;
        this.currentRow = 0;
        this.currentCol = 0;
        this.currentCode = [];
        this.board = [];
        this.colors = ["blue", "red", "green", "yellow", "cyan", "magenta", "orange", "lime"];
        this.thead = document.querySelector("#board thead");
        this.tbody = document.querySelector("#board tbody");
        let button = document.querySelector("#start");
        button.onclick = this.init.bind(this);
    }
    addColor(color) {
        if (this.currentCode.length >= this.game.getNumOfCodes()) {
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
        this.game = new Mastermind(numberOfColors, numberOfCodes, numberOfTries);
        this.player = new MastermindPlayer(this.game);
        this.printBoard();
        this.printColors();
        this.setMessage("");
        this.currentRow = numberOfTries - 1;
        this.currentCol = 0;
        this.currentCode = [];
        this.board = [];
        this.registerEvents();
    }
    registerEvents() {
        let button = document.querySelector("#check");
        button.onclick = this.check.bind(this);
        button = document.querySelector("#backspace");
        button.onclick = this.removeColor.bind(this);
        button = document.querySelector("#hint");
        button.onclick = this.hint.bind(this);
    }
    unregisterEvents() {
        let button = document.querySelector("#check");
        button.onclick = undefined;
        button = document.querySelector("#backspace");
        button.onclick = undefined;
        button = document.querySelector("#hint");
        button.onclick = undefined;
    }
    printBoard() {
        this.thead.innerHTML = "";
        let tr = document.createElement("tr");
        this.thead.appendChild(tr);
        for (let j = 0; j < this.game.getNumOfCodes(); j++) {
            tr.appendChild(document.createElement("td"));
        }
        this.tbody.innerHTML = "";
        for (let i = 0; i < this.game.getNumOfTries(); i++) {
            tr = document.createElement("tr");
            this.tbody.appendChild(tr);
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
            tr.appendChild(document.createElement("td"));
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
    hint() {
        this.play(() => {
            let code = this.player.createCode(this.board);
            code.forEach(c => this.addColor(this.colors[c]));
            let result = this.game.play(code);
            this.board.push({ question: code, answer: result.getHint() });
            return result;
        });
    }
    check() {
        this.play(() => {
            let result = this.game.play(this.currentCode);
            this.board.push({ question: this.currentCode, answer: result.getHint() });
            return result;
        });
    }
    play(method) {
        try {
            let ret = method();
            this.showHint(ret.getHint());
            if (ret.getWinner() === Winner.WIN) {
                this.showAnswer(this.currentCode);
                this.setMessage("Game over. You win!");
                this.unregisterEvents();
            } else if (ret.getWinner() === Winner.LOSE) {
                this.showAnswer(this.game.CODE);
                this.setMessage("Game over. You lose!");
                this.unregisterEvents();
            } else {
                this.currentRow--;
                this.currentCol = 0;
                this.currentCode = [];
            }
        } catch (ex) {
            this.setMessage(ex.message);
        }
    }
    showAnswer(answer) {
        let tds = this.thead.querySelectorAll("td");
        tds.forEach( (elem, index) => {
            elem.style.backgroundColor = this.colors[answer[index]];
            elem.style.borderColor = this.colors[answer[index]];
        });
    }
    showHint(result) {
        let correctCell = this.tbody.querySelector(`tr:nth-child(${this.game.getNumOfTries() + 1}) td:nth-last-child(2)`);
        correctCell.textContent = result.filter(n => n == 2).length;
        let wrongCell = this.tbody.querySelector(`tr:nth-child(${this.game.getNumOfTries() + 1}) td:last-child`);
        wrongCell.textContent = result.filter(n => n == 1).length;
    }
}
let gui = new GUI();
gui.init();