import Mastermind from "./Mastermind.js";
import MastermindPlayer from "./MastermindPlayer.js";
import Winner from "./Winner.js";

class Test {
    play(numOfCodes, numOfTries, numOfColors) {
        let m = new Mastermind(numOfColors, numOfCodes, numOfTries);
        let player = new MastermindPlayer(m);
        for (let i = 0; i < numOfTries; i++) {
            let code = player.createCode();
            let result = m.play(code);
            player.answerCode(code, result.getHint());
            if (result.getWinner() === Winner.WIN) {
                return true;
            }
        }
        return false;
    }
}

let acertos = 0;
for (let i = 0; i < 500; i++) {
    let t = new Test();
    if (t.play(4, 8, 8)) {
        acertos++;
    }
}
console.log(acertos);