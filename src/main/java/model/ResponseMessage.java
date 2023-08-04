package model;

import java.util.List;

public record ResponseMessage(State state, List<Integer> code, List<Integer> password) {

}