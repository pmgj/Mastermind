import Mastermind from "./Mastermind.js";
import MastermindPlayer from "./MastermindPlayer.js";

class Test {
    constructor() {

    }
    play(numOfCodes, numOfTries, numOfColors) {
        let m = new Mastermind(numOfColors, numOfCodes, numOfTries);
        let player = new MastermindPlayer(m);
        let board = [];
        for (let i = 0; i < numOfTries; i++) {
            let code = player.createCode(board);
            let result = m.check(code);
            board.push({ question: code, answer: result });
            if (result.every(e => e === 2)) {
                return true;
            }
        }
        return false;
    }
}

let acertos = 0;
for (let i = 0; i < 100; i++) {
    let t = new Test();
    if (t.play(4, 10, 6)) {
        acertos++;
    }
}
console.log(acertos);
