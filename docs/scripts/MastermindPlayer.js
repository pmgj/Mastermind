export default class MastermindPlayer {
    constructor(game) {
        this.m = game;
        this.solutions = this.setSolutions();
    }
    setSolutions() {
        let numbers = Array.apply(null, { length: this.m.getNumOfColors() }).map(Number.call, Number);
        return this.simpleArrange(numbers, this.m.getNumOfCodes(), true);
    }
    simpleArrange(a, n, m) {
        let o = a;
        if (n >= o.length)
            return [];
        let x;
        for (var j, l, k, p, f, r, q = k = 1, i = (l = o.length) + 1, j = l - n; --i; i <= j ? q *= i : k *= i)
            ;
        for (x = [new Array(n), new Array(n), new Array(n), new Array(n)], j = q = k * q / q, k = l + 1, i = - 1;
            ++i < n; x[2][i] = i, x[1][i] = x[0][i] = j /= --k)
            ;
        for (r = new Array(q), p = - 1; ++p < q;)
            for (r[p] = new Array(n), i = - 1; ++i < n; !--x[1][i] && (x[1][i] = x[0][i],
                x[2][i] = (x[2][i] + 1) % l), r[p][i] = m ? x[3][i] : o[x[3][i]])
                for (x[3][i] = x[2][i], f = 0; !f; f = !f)
                    for (j = i; j;)
                        if (x[3][--j] === x[2][i]) {
                            x[3][i] = x[2][i] = (x[2][i] + ++f) % l;
                            break;
                        }
        return r;
    }
    createCode() {
        return this.solutions[0];
    }
    answerCode(code, result) {
        this.solutions = this.solutions.filter(elem => {
            let temp = this.m.check(elem, code);
            return JSON.stringify(temp) === JSON.stringify(result);
        });
    }
}