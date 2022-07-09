import Mastermind from "./Mastermind.js";
import Winner from "./Winner.js";

function GUI() {
    let game;
    let selectedColor = null;
    let colors = ["blue", "red", "green", "yellow", "brown", "magenta", "orange", "silver"];
    function init() {
        let s = document.querySelector("#numberOfCodes");
        let numberOfCodes = parseInt(s.value);
        s = document.querySelector("#numberOfColors");
        let numberOfColors = parseInt(s.value);
        s = document.querySelector("#numberOfTries");
        let numberOfTries = parseInt(s.value);
        game = new Mastermind(numberOfColors, numberOfCodes, numberOfTries);
        printBoard();
        printColors();
        setMessage("");
        setActiveRow();
    }
    function registerEvents() {
        let button = document.querySelector("#check");
        button.onclick = check;
        button = document.querySelector("#start");
        button.onclick = init;
        init();
    }
    function printBoard() {
        let thead = document.querySelector("#board thead");
        thead.innerHTML = "";

        let tr = document.createElement("tr");
        thead.appendChild(tr);

        for (let i = 0; i <= game.getNumOfCodes(); i++) {
            tr.appendChild(document.createElement("td"));
        }

        let tbody = document.querySelector("#board tbody");
        tbody.innerHTML = "";

        for (let i = 0; i < game.getNumOfTries(); i++) {
            tr = document.createElement("tr");
            tbody.appendChild(tr);
            for (let j = 0; j < game.getNumOfCodes(); j++) {
                tr.appendChild(document.createElement("td"));
            }
            let ltd = document.createElement("td");
            tr.appendChild(ltd);

            let table = document.createElement("table");
            ltd.appendChild(table);

            tr = document.createElement("tr");
            table.appendChild(tr);

            for (let k = 0; k < game.getNumOfCodes(); k++) {
                if (k === Math.round(game.getNumOfCodes() / 2)) {
                    tr = document.createElement("tr");
                    table.appendChild(tr);
                }
                let td = document.createElement("td");
                tr.appendChild(td);
            }
        }
    }
    function printColors() {
        let table = document.querySelector("#colors");
        table.innerHTML = "";

        let tr = document.createElement("tr");
        table.appendChild(tr);

        for (let i = 0; i < game.getNumOfColors(); i++) {
            if (i === Math.round(game.getNumOfColors() / 2)) {
                tr = document.createElement("tr");
                table.appendChild(tr);
            }
            let td = document.createElement("td");
            tr.appendChild(td);
        }

        let tds = document.querySelectorAll("#colors td");
        tds.forEach((elem, index) => {
            elem.style.backgroundColor = colors[index];
            elem.onclick = setColor;
        });
    }
    function setColor(ev) {
        selectedColor = ev.target.style.backgroundColor;
    }
    function setRowColor(ev) {
        ev.target.style.backgroundColor = selectedColor;
        ev.target.style.borderColor = selectedColor;
    }
    function setMessage(text) {
        let ret = document.querySelector("#message");
        ret.textContent = text;
    }
    function setActiveRow() {
        let cells = document.querySelectorAll(`#board > tbody > tr:not(:nth-child(${game.getNumOfTries()})) > td:not(:last-child)`);
        cells.forEach(elem => elem.removeEventListener("click", setRowColor));
        let cells2 = document.querySelectorAll(`#board > tbody > tr:nth-child(${game.getNumOfTries()}) > td:not(:last-child)`);
        cells2.forEach(elem => elem.addEventListener("click", setRowColor));
    }
    function check() {
        let cells = document.querySelectorAll(`#board > tbody > tr:nth-child(${game.getNumOfTries()}) > td:not(:last-child)`);
        let result = [];
        for (let cell of cells) {
            let corDeFundo = cell.style.backgroundColor;
            let colorIndex = colors.indexOf(corDeFundo);
            result.push(colorIndex);
        }
        try {
            let ret = game.play(result);
            showHint(ret.getHint());
            if (ret.getWinner() === Winner.WIN) {
                showCode(ret.getCode());
                setMessage("Game over. You win!");
            } else if (ret.getWinner() === Winner.LOSE) {
                showCode(ret.getCode());
                setMessage("Game over. You lose!");
            } else {
                setActiveRow();
            }
        } catch (ex) {
            setMessage(ex.message);
        }
    }
    function showHint(result) {
        let cells = document.querySelectorAll(`#board > tbody > tr:nth-child(${game.getNumOfTries() + 1}) > td:last-child td`);
        let hint = ["white", "gray", "red"];
        for (let i = 0; i < result.length; i++) {
            cells[i].style.backgroundColor = hint[result[i]];
            cells[i].style.borderColor = hint[result[i]];
        }
    }
    function showCode(code) {
        let cells = document.querySelectorAll("#board thead td:not(:last-child)");
        cells.forEach((elem, index) => {
            elem.style.backgroundColor = colors[code[index]];
            elem.style.borderColor = colors[code[index]];
        });
    }
    return { registerEvents };
}

let gui = new GUI();
gui.registerEvents();