export default class MoveResult {
    constructor(winner, hint, code) {
        this.code = code;
        this.winner = winner;
        this.hint = hint;
    }
    getCode() {
        return this.code;
    }
    getHint() {
        return this.hint;
    }
    getWinner() {
        return this.winner;
    }
}