package model;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Mastermind {

    private final Integer numOfColors;
    private Integer numOfTries;
    private final Integer numOfCodes;
    private List<Integer> password;

    public Mastermind(Integer numOfColors, Integer numOfTries, Integer numOfCodes) {
        this.numOfColors = numOfColors;
        this.numOfTries = numOfTries;
        this.numOfCodes = numOfCodes;
        this.createPassword();
    }

    private final void createPassword() {
        List<Integer> numbers = new ArrayList<>();
        for (int i = 0; i < numOfColors; i++) {
            numbers.add(i);
        }
        Collections.shuffle(numbers);
        this.password = new ArrayList<>();
        for (int i = 0; i < numOfCodes; i++) {
            this.password.add(numbers.get(i));
        }
    }

    public ResponseMessage testCode(int[] code) {
        List<Integer> r = this.check(code);
        if (r.stream().allMatch(elem -> elem == 2)) {
            return new ResponseMessage(State.WIN, r, this.password);
        } else {
            this.numOfTries--;
            if (this.numOfTries == 0) {
                return new ResponseMessage(State.LOSE, r, this.password);
            } else {
                return new ResponseMessage(State.VALID, r, null);
            }
        }
    }

    private List<Integer> check(int[] test1) {
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < password.size(); i++) {
            int number = test1[i];
            int index = password.indexOf(number);
            if (index == -1) {
                /* Cor não está na senha */
                result.add(0);
            } else if (number == password.get(i)) {
                /* Cor está na senha na posição correta */
                result.add(2);
            } else {
                /* Cor está na senha em posição incorreta */
                result.add(1);
            }
        }
        Collections.sort(result, Collections.reverseOrder());
        return result;
    }
}
