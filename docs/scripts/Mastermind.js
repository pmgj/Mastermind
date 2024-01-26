import MoveResult from "./MoveResult.js";
import Winner from "./Winner.js";

export default class Mastermind {
    constructor(numColors, numCodes, numTries) {
        if (numCodes > numColors) {
            throw new Error("The number of codes must be less than or equal to the number of colors!");
        }
        this.colors = numColors;
        this.codes = numCodes;
        this.tries = numTries;
        this.CODE = this.setCode();
    }
    getNumOfCodes() {
        return this.codes;
    }
    getNumOfTries() {
        return this.tries;
    }
    getNumOfColors() {
        return this.colors;
    }
    setCode() {
        let password = new Array(this.codes);
        let numbers = Array.apply(null, { length: this.colors }).map(Number.call, Number);
        numbers = this.shuffle(numbers);
        for (let i = 0; i < this.codes; i++) {
            password[i] = numbers[i];
        }
        return password;
    }
    shuffle(o) {
        for (let j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
            ;
        return o;
    }
    check(value, template = this.CODE) {
        let result = [];
        for (let i = 0; i < template.length; i++) {
            let number = value[i];
            result.push(!template.includes(number) ? 0 : number === template[i] ? 2 : 1);
        }
        result.sort((a, b) => b - a);
        return result;
    }
    play(value) {
        if (this.tries <= 0) {
            throw new Error("Game over! You do not have more tries!");
        }
        if (!Array.isArray(value)) {
            throw new Error("The submitted code is in an incorrect format.");
        }
        if (value.some(v => !Number.isInteger(v))) {
            throw new Error("The submitted code must only contain integers.");
        }
        if (value.some(v => v < 0 || v >= this.colors)) {
            throw new Error("There are incorrect values in the submitted code.");
        }
        if (value.length !== this.codes) {
            throw new Error("The size of the submitted code is invalid.");
        }
        this.tries--;
        let result = this.check(value);
        if (result.every(e => e === 2)) {
            return new MoveResult(Winner.WIN, result, this.CODE);
        }
        if (this.tries === 0) {
            return new MoveResult(Winner.LOSE, result, this.CODE);
        }
        return new MoveResult(Winner.NONE, result);
    }
}
